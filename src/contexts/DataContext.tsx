import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
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

interface DataContextType {
  banners: Banner[];
  members: Member[];
  events: AppEvent[];
  books: Book[];
  partners: Partner[];
  faqs: FAQ[];
  loading: boolean;
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
const mapEvent = (r: any): AppEvent => ({ id: r.id, title: r.title, date: r.event_date, time: r.event_time || "", location: r.location || "", category: r.category || "", description: r.description || "" });
const mapBook = (r: any): Book => ({ id: r.id, title: r.title, author: r.author || "", synopsis: r.synopsis || "", meetingDate: r.meeting_date || "", buyLink: r.buy_link || "", coverUrl: r.cover_url || "", status: (r.status as Book["status"]) || "upcoming" });
const mapPartner = (r: any): Partner => ({ id: r.id, name: r.name, category: r.category || "", description: r.description || "", website: r.website || "", discountCode: r.discount_code || "", discountPercent: r.discount_percent || "", logoUrl: r.logo_url || "", isActive: r.is_active ?? true });
const mapFaq = (r: any): FAQ => ({ id: r.id, question: r.question, answer: r.answer });

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const [b, m, e, bk, p, f] = await Promise.all([
      supabase.from("banners").select("*").order("created_at"),
      supabase.from("members").select("*").order("created_at"),
      supabase.from("events").select("*").order("event_date"),
      supabase.from("books").select("*").order("created_at"),
      supabase.from("partners").select("*").order("created_at"),
      supabase.from("faqs").select("*").order("created_at"),
    ]);

    if (b.error) console.error("Erro ao carregar banners:", b.error.message);
    if (m.error) console.error("Erro ao carregar membros:", m.error.message);
    if (e.error) console.error("Erro ao carregar eventos:", e.error.message);
    if (bk.error) console.error("Erro ao carregar livros:", bk.error.message);
    if (p.error) console.error("Erro ao carregar parceiros:", p.error.message);
    if (f.error) console.error("Erro ao carregar FAQs:", f.error.message);

    setBanners((b.data || []).map(mapBanner));
    setMembers((m.data || []).map(mapMember));
    setEvents((e.data || []).map(mapEvent));
    setBooks((bk.data || []).map(mapBook));
    setPartners((p.data || []).map(mapPartner));
    setFaqs((f.data || []).map(mapFaq));
    setLoading(false);
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

  return (
    <DataContext.Provider value={{
      banners, members, events, books, partners, faqs, loading, refetch,
      addBanner, updateBanner, deleteBanner,
      addMember, updateMember, deleteMember,
      addEvent, updateEvent, deleteEvent,
      addBook, updateBook, deleteBook,
      addPartner, updatePartner, deletePartner,
      addFaq, updateFaq, deleteFaq,
    }}>
      {children}
    </DataContext.Provider>
  );
};
