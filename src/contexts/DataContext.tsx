import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import heroBg from "@/assets/hero-bg.jpg";

// Types matching DB schema
export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  cta: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  photoUrl: string;
  status: "active" | "inactive";
}

export interface AppEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  mapsLink?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  synopsis: string;
  meetingDate: string;
  buyLink: string;
  coverUrl: string;
  status: "current" | "finished" | "upcoming";
}

export interface Partner {
  id: string;
  name: string;
  category: string;
  description: string;
  website: string;
  discountCode: string;
  discountPercent: string;
  logoUrl: string;
  isActive: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  isActive: boolean;
}

interface DataContextType {
  banners: Banner[];
  members: Member[];
  events: AppEvent[];
  books: Book[];
  partners: Partner[];
  faqs: FAQ[];
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  initialLoadDone: boolean;
  refetch: () => Promise<void>;
  // CRUD helpers
  addBanner: (b: Omit<Banner, "id">) => Promise<void>;
  updateBanner: (id: string, b: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  addMember: (m: Omit<Member, "id">) => Promise<void>;
  updateMember: (id: string, m: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  addEvent: (e: Omit<AppEvent, "id">) => Promise<void>;
  updateEvent: (id: string, e: Partial<AppEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addBook: (b: Omit<Book, "id">) => Promise<void>;
  updateBook: (id: string, b: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  addPartner: (p: Omit<Partner, "id">) => Promise<void>;
  updatePartner: (id: string, p: Partial<Partner>) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  addFaq: (f: Omit<FAQ, "id">) => Promise<void>;
  updateFaq: (id: string, f: Partial<FAQ>) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  addTestimonial: (t: Omit<Testimonial, "id">) => Promise<void>;
  updateTestimonial: (id: string, t: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

// Map DB row to frontend type
const mapBanner = (r: any): Banner => ({ id: r.id, title: r.title, subtitle: r.subtitle || "", imageUrl: r.image_url || heroBg, cta: r.cta || "" });
const mapMember = (r: any): Member => ({ id: r.id, name: r.name, email: r.email || "", phone: r.phone || "", role: r.role || "", photoUrl: r.photo_url || "", status: (r.status as "active" | "inactive") || "active" });
const mapEvent = (r: any): AppEvent => ({ id: r.id, title: r.title, date: r.event_date, time: r.event_time || "", location: r.location || "", category: r.category || "", description: r.description || "", mapsLink: r.maps_link || "" });
const mapBook = (r: any): Book => ({ id: r.id, title: r.title, author: r.author || "", synopsis: r.synopsis || "", meetingDate: r.meeting_date || "", buyLink: r.buy_link || "", coverUrl: r.cover_url || "", status: (r.status as Book["status"]) || "upcoming" });
const mapPartner = (r: any): Partner => ({ id: r.id, name: r.name, category: r.category || "", description: r.description || "", website: r.website || "", discountCode: r.discount_code || "", discountPercent: r.discount_percent || "", logoUrl: r.logo_url || "", isActive: r.is_active ?? true });
const mapFaq = (r: any): FAQ => ({ id: r.id, question: r.question, answer: r.answer });
const mapTestimonial = (r: any): Testimonial => ({ id: r.id, name: r.name, role: r.role || "", text: r.text || "", isActive: r.is_active ?? true });

type TableName = keyof Database["public"]["Tables"];

// Helper: fetch a single table with retry and timeout
async function fetchTable<T>(
  table: TableName,
  orderBy: string,
  mapper: (r: any) => T,
  maxRetries = 3,
  timeoutMs = 10000,
): Promise<{ data: T[]; error: string | null }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order(orderBy)
        .abortSignal(controller.signal);

      clearTimeout(timeout);

      if (error) {
        console.warn(`[DataContext] Erro ao carregar ${table} (tentativa ${attempt}/${maxRetries}):`, error.message);
        if (attempt === maxRetries) {
          return { data: [], error: error.message };
        }
        // Exponential backoff: 500ms, 1000ms, 2000ms
        await new Promise((res) => setTimeout(res, 500 * Math.pow(2, attempt - 1)));
        continue;
      }

      return { data: (data || []).map(mapper), error: null };
    } catch (err: any) {
      const msg = err?.name === "AbortError" ? `Timeout ao carregar ${table}` : (err?.message || "Erro desconhecido");
      console.warn(`[DataContext] Exceção ao carregar ${table} (tentativa ${attempt}/${maxRetries}):`, msg);
      if (attempt === maxRetries) {
        return { data: [], error: msg };
      }
      await new Promise((res) => setTimeout(res, 500 * Math.pow(2, attempt - 1)));
    }
  }
  return { data: [], error: "Falha após todas as tentativas" };
}

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const fetchingRef = useRef(false);

  const refetch = useCallback(async () => {
    // Prevent concurrent fetches
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      setError(null);

      // Fetch all tables in parallel, but each with its own retry/timeout
      const [b, m, e, bk, p, f, t] = await Promise.all([
        fetchTable("banners", "created_at", mapBanner),
        fetchTable("members", "created_at", mapMember),
        fetchTable("events", "event_date", mapEvent),
        fetchTable("books", "created_at", mapBook),
        fetchTable("partners", "created_at", mapPartner),
        fetchTable("faqs", "created_at", mapFaq),
        fetchTable("testimonials", "created_at", mapTestimonial),
      ]);

      // Update state with whatever data we got (partial success is better than nothing)
      setBanners(b.data);
      setMembers(m.data);
      setEvents(e.data);
      setBooks(bk.data);
      setPartners(p.data);
      setFaqs(f.data);
      setTestimonials(t.data);

      // Collect errors
      const errors = [b, m, e, bk, p, f, t]
        .filter((r) => r.error)
        .map((r) => r.error);
      if (errors.length > 0) {
        setError(`Falha ao carregar: ${errors.join("; ")}`);
      }
    } catch (err: any) {
      console.error("[DataContext] Erro inesperado no refetch:", err);
      setError(err?.message || "Erro inesperado ao carregar dados");
    } finally {
      // ALWAYS set loading to false — this was the critical bug
      setLoading(false);
      setInitialLoadDone(true);
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  // CRUD helpers
  const addBanner = async (b: Omit<Banner, "id">) => {
    const { error } = await supabase
      .from("banners")
      .insert({ title: b.title, subtitle: b.subtitle, image_url: b.imageUrl, cta: b.cta });
    if (error) throw error;
    await refetch();
  };
  const updateBanner = async (id: string, b: Partial<Banner>) => {
    const update: any = {};
    if (b.title !== undefined) update.title = b.title;
    if (b.subtitle !== undefined) update.subtitle = b.subtitle;
    if (b.imageUrl !== undefined) update.image_url = b.imageUrl;
    if (b.cta !== undefined) update.cta = b.cta;
    const { error } = await supabase.from("banners").update(update).eq("id", id);
    if (error) throw error;
    await refetch();
  };
  const deleteBanner = async (id: string) => {
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) throw error;
    await refetch();
  };

  const addMember = async (m: Omit<Member, "id">) => {
    const { error } = await supabase
      .from("members")
      .insert({ name: m.name, email: m.email, phone: m.phone, role: m.role, photo_url: m.photoUrl, status: m.status });
    if (error) throw error;
    await refetch();
  };
  const updateMember = async (id: string, m: Partial<Member>) => {
    const update: any = {};
    if (m.name !== undefined) update.name = m.name;
    if (m.email !== undefined) update.email = m.email;
    if (m.phone !== undefined) update.phone = m.phone;
    if (m.role !== undefined) update.role = m.role;
    if (m.photoUrl !== undefined) update.photo_url = m.photoUrl;
    if (m.status !== undefined) update.status = m.status;
    const { error } = await supabase.from("members").update(update).eq("id", id);
    if (error) throw error;
    await refetch();
  };
  const deleteMember = async (id: string) => {
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) throw error;
    await refetch();
  };

  const addEvent = async (e: Omit<AppEvent, "id">) => {
    const { error } = await supabase
      .from("events")
      .insert({
        title: e.title,
        event_date: e.date,
        event_time: e.time,
        location: e.location,
        category: e.category,
        description: e.description,
        maps_link: e.mapsLink,
      });
    if (error) throw error;
    await refetch();
  };
  const updateEvent = async (id: string, e: Partial<AppEvent>) => {
    const update: any = {};
    if (e.title !== undefined) update.title = e.title;
    if (e.date !== undefined) update.event_date = e.date;
    if (e.time !== undefined) update.event_time = e.time;
    if (e.location !== undefined) update.location = e.location;
    if (e.category !== undefined) update.category = e.category;
    if (e.description !== undefined) update.description = e.description;
    if (e.mapsLink !== undefined) update.maps_link = e.mapsLink;
    const { error } = await supabase.from("events").update(update).eq("id", id);
    if (error) throw error;
    await refetch();
  };
  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw error;
    await refetch();
  };

  const addBook = async (b: Omit<Book, "id">) => {
    const { error } = await supabase
      .from("books")
      .insert({
        title: b.title,
        author: b.author,
        synopsis: b.synopsis,
        meeting_date: b.meetingDate,
        buy_link: b.buyLink,
        cover_url: b.coverUrl,
        status: b.status,
      });
    if (error) throw error;
    await refetch();
  };
  const updateBook = async (id: string, b: Partial<Book>) => {
    const update: any = {};
    if (b.title !== undefined) update.title = b.title;
    if (b.author !== undefined) update.author = b.author;
    if (b.synopsis !== undefined) update.synopsis = b.synopsis;
    if (b.meetingDate !== undefined) update.meeting_date = b.meetingDate;
    if (b.buyLink !== undefined) update.buy_link = b.buyLink;
    if (b.coverUrl !== undefined) update.cover_url = b.coverUrl;
    if (b.status !== undefined) update.status = b.status;
    const { error } = await supabase.from("books").update(update).eq("id", id);
    if (error) throw error;
    await refetch();
  };
  const deleteBook = async (id: string) => {
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) throw error;
    await refetch();
  };

  const addPartner = async (p: Omit<Partner, "id">) => {
    const { error } = await supabase
      .from("partners")
      .insert({
        name: p.name,
        category: p.category,
        description: p.description,
        website: p.website,
        discount_code: p.discountCode,
        discount_percent: p.discountPercent,
        logo_url: p.logoUrl,
        is_active: p.isActive,
      });
    if (error) throw error;
    await refetch();
  };
  const updatePartner = async (id: string, p: Partial<Partner>) => {
    const update: any = {};
    if (p.name !== undefined) update.name = p.name;
    if (p.category !== undefined) update.category = p.category;
    if (p.description !== undefined) update.description = p.description;
    if (p.website !== undefined) update.website = p.website;
    if (p.discountCode !== undefined) update.discount_code = p.discountCode;
    if (p.discountPercent !== undefined) update.discount_percent = p.discountPercent;
    if (p.logoUrl !== undefined) update.logo_url = p.logoUrl;
    if (p.isActive !== undefined) update.is_active = p.isActive;
    const { error } = await supabase.from("partners").update(update).eq("id", id);
    if (error) throw error;
    await refetch();
  };
  const deletePartner = async (id: string) => {
    const { error } = await supabase.from("partners").delete().eq("id", id);
    if (error) throw error;
    await refetch();
  };

  const addFaq = async (f: Omit<FAQ, "id">) => {
    const { error } = await supabase.from("faqs").insert({ question: f.question, answer: f.answer });
    if (error) throw error;
    await refetch();
  };
  const updateFaq = async (id: string, f: Partial<FAQ>) => {
    const update: any = {};
    if (f.question !== undefined) update.question = f.question;
    if (f.answer !== undefined) update.answer = f.answer;
    const { error } = await supabase.from("faqs").update(update).eq("id", id);
    if (error) throw error;
    await refetch();
  };
  const deleteFaq = async (id: string) => {
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) throw error;
    await refetch();
  };

  const addTestimonial = async (t: Omit<Testimonial, "id">) => {
    const { error } = await supabase.from("testimonials").insert({ name: t.name, role: t.role, text: t.text, is_active: t.isActive });
    if (error) throw error;
    await refetch();
  };
  const updateTestimonial = async (id: string, t: Partial<Testimonial>) => {
    const update: any = {};
    if (t.name !== undefined) update.name = t.name;
    if (t.role !== undefined) update.role = t.role;
    if (t.text !== undefined) update.text = t.text;
    if (t.isActive !== undefined) update.is_active = t.isActive;
    const { error } = await supabase.from("testimonials").update(update).eq("id", id);
    if (error) throw error;
    await refetch();
  };
  const deleteTestimonial = async (id: string) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) throw error;
    await refetch();
  };

  return (
    <DataContext.Provider value={{
      banners, members, events, books, partners, faqs, testimonials, loading, error, initialLoadDone, refetch,
      addBanner, updateBanner, deleteBanner,
      addMember, updateMember, deleteMember,
      addEvent, updateEvent, deleteEvent,
      addBook, updateBook, deleteBook,
      addPartner, updatePartner, deletePartner,
      addFaq, updateFaq, deleteFaq,
      addTestimonial, updateTestimonial, deleteTestimonial,
    }}>
      {children}
    </DataContext.Provider>
  );
};
