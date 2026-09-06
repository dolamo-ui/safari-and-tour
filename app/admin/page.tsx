"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, setDoc, Timestamp } from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { db, auth } from "../lib/firebase";
import { defaultContactSettings, type ContactSettings } from "../lib/siteSettings";

/* ========================================================================   Malikan Tours — Admin Bookings (Tours + Accommodation + Contact)   ======================================================================== */

type BookingStatus = "confirmed" | "pending" | "cancelled";
type BookingType = "tour" | "accommodation";
type ViewMode = "all" | "tours" | "accommodation" | "contact" | "settings";
type ContactStatus = "new" | "read" | "resolved";

type Booking = {
  id: string;
  type: BookingType;
  initials: string;
  avatarGradient: string;
  name: string;
  title: string;
  date: string;
  status: BookingStatus;
  statusLabel: string;
  amount: string;
  rawDate: string;
  // common detail fields
  reference?: string;
  guests?: number;
  customerPhone?: string;
  customerAltPhone?: string;
  customerEmail?: string;
  specialRequests?: string;
  createdAt?: Timestamp;
  // tour specific
  tourId?: string;
  pricePerPerson?: number;
  estimatedTotal?: number;
  // accommodation specific
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  accomType?: string;
  accomTypeLabel?: string;
  pricePerNight?: number;
};

type ContactMessage = {
  id: string;
  initials: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: ContactStatus;
  statusLabel: string;
  date: string;
  sortKey: number;
  createdAt?: Timestamp;
  reference: string;
};

/* ---------------------------- Icons ---------------------------- */

const svgBase = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function BookingsIcon() {
  return (
    <svg {...svgBase}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function TourIcon() {
  return (
    <svg width="20" height="20" {...svgBase}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg width="20" height="20" {...svgBase}>
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8v9" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg {...svgBase}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" {...svgBase}>
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" {...svgBase}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" {...svgBase}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg width="18" height="18" {...svgBase}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function TrendDownIcon() {
  return (
    <svg width="18" height="18" {...svgBase}>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" {...svgBase}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" {...svgBase}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" {...svgBase}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="16" height="16" {...svgBase}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="16" height="16" {...svgBase}>
      <path d="M12 2H2v10l9 9 9-9-8-8Z" />
      <circle cx="7" cy="7" r="1" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" {...svgBase}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" {...svgBase}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" {...svgBase}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="20" height="20" {...svgBase}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" {...svgBase}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" {...svgBase}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/* ---------------------------- Components ---------------------------- */

const statusClass: Record<BookingStatus, string> = {
  confirmed: "status-confirmed",
  pending: "status-pending",
  cancelled: "status-cancelled",
};

const contactStatusClass: Record<ContactStatus, string> = {
  new: "status-pending",
  read: "status-confirmed",
  resolved: "status-resolved",
};

const contactStatusLabel: Record<ContactStatus, string> = {
  new: "New",
  read: "Read",
  resolved: "Resolved",
};

function StatusPill({ status, label }: { status: BookingStatus | ContactStatus; label: string }) {
  const cls = (contactStatusClass as Record<string, string>)[status] ?? statusClass[status as BookingStatus];
  return <span className={`status-pill ${cls}`}>{label}</span>;
}

function DetailField({ label, value }: { label: string; value?: React.ReactNode }) {
  if (value === undefined || value === null || value === "") return null;
  return <div className="detail-field"><dt>{label}</dt><dd>{value}</dd></div>;
}

/* ================================ Page ================================= */

export default function AdminBookingsPage() {
  /* Auth state */
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginSubmitting) return;
    setLoginError("");
    setLoginSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      setLoginPassword("");
    } catch (err: any) {
      const code = err?.code as string | undefined;
      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        setLoginError("Incorrect email or password.");
      } else if (code === "auth/too-many-requests") {
        setLoginError("Too many attempts. Please wait a moment and try again.");
      } else if (code === "auth/invalid-email") {
        setLoginError("Please enter a valid email address.");
      } else {
        setLoginError("Could not sign in. Please try again.");
      }
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("all");
  const [tourBookings, setTourBookings] = useState<Booking[]>([]);
  const [accomBookings, setAccomBookings] = useState<Booking[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [toursLoaded, setToursLoaded] = useState(false);
  const [accomLoaded, setAccomLoaded] = useState(false);
  const [contactLoaded, setContactLoaded] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [contactError, setContactError] = useState("");
  const [contactSettings, setContactSettings] = useState<ContactSettings>(defaultContactSettings);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "error" | "success" } | null>(null);

  useEffect(() => {
    if (!sidebarOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [sidebarOpen]);

  /* Lightweight themed toast — replaces alert() */
  const showToast = (message: string, tone: "error" | "success" = "error") => {
    setToast({ message, tone });
  };
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  /* Live Firestore listeners — tours + accommodation */
  useEffect(() => {
    if (!user) return;
    const unsubTours = onSnapshot(
      collection(db, "bookings"),
      (snapshot) => {
        const mapped = snapshot.docs.map((d) => {
          const data = d.data();
          const name = typeof data.customerName === "string" ? data.customerName : "Unknown customer";
          const status = data.status === "confirmed" || data.status === "cancelled" ? data.status : "pending";
          const amount = typeof data.estimatedTotal === "number" ? `R ${data.estimatedTotal.toLocaleString("en-ZA")}` : "—";
          const rawDate = typeof data.tourDate === "string" ? data.tourDate : "";
          return {
            id: d.id,
            type: "tour" as const,
            initials: name.split(" ").map((p: string) => p[0] ?? "").join("").slice(0, 2).toUpperCase(),
            avatarGradient: "linear-gradient(135deg, var(--gold), var(--gold-bright))",
            name,
            title: typeof data.tourName === "string" ? data.tourName : "Tour not specified",
            date: rawDate ? new Date(rawDate).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" }) : "—",
            status,
            statusLabel: status.charAt(0).toUpperCase() + status.slice(1),
            amount,
            rawDate,
            reference: typeof data.reference === "string" ? data.reference : undefined,
            tourId: typeof data.tourId === "string" ? data.tourId : undefined,
            guests: typeof data.guests === "number" ? data.guests : undefined,
            pricePerPerson: typeof data.pricePerPerson === "number" ? data.pricePerPerson : undefined,
            estimatedTotal: typeof data.estimatedTotal === "number" ? data.estimatedTotal : undefined,
            customerPhone: typeof data.customerPhone === "string" ? data.customerPhone : undefined,
            customerAltPhone: typeof data.customerAltPhone === "string" ? data.customerAltPhone : undefined,
            customerEmail: typeof data.customerEmail === "string" ? data.customerEmail : undefined,
            specialRequests: typeof data.specialRequests === "string" ? data.specialRequests : undefined,
            createdAt: data.createdAt,
          };
        }).sort((a, b) => b.rawDate.localeCompare(a.rawDate));
        setTourBookings(mapped);
        setBookingError("");
        setToursLoaded(true);
      },
      (err) => {
        console.error(err);
        setBookingError("Could not load tour bookings. Check Firebase rules.");
        setToursLoaded(true);
      }
    );

    const unsubAccom = onSnapshot(
      collection(db, "accommodationBookings"),
      (snapshot) => {
        const mapped = snapshot.docs.map((d) => {
          const data = d.data();
          const name = typeof data.customerName === "string" ? data.customerName : "Unknown customer";
          const status = data.status === "confirmed" || data.status === "cancelled" ? data.status : "pending";
          const amount = typeof data.estimatedTotal === "number" ? `R ${data.estimatedTotal.toLocaleString("en-ZA")}` : "—";
          const rawDate = typeof data.checkIn === "string" ? data.checkIn : "";
          return {
            id: d.id,
            type: "accommodation" as const,
            initials: name.split(" ").map((p: string) => p[0] ?? "").join("").slice(0, 2).toUpperCase(),
            avatarGradient: "linear-gradient(135deg, #4a7c59, #6abf69)",
            name,
            title: typeof data.accomTypeLabel === "string" ? data.accomTypeLabel : "Accommodation",
            date: rawDate ? new Date(rawDate).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" }) : "—",
            status,
            statusLabel: status.charAt(0).toUpperCase() + status.slice(1),
            amount,
            rawDate,
            reference: typeof data.reference === "string" ? data.reference : undefined,
            guests: typeof data.guests === "number" ? data.guests : undefined,
            customerPhone: typeof data.customerPhone === "string" ? data.customerPhone : undefined,
            customerAltPhone: typeof data.customerAltPhone === "string" ? data.customerAltPhone : undefined,
            customerEmail: typeof data.customerEmail === "string" ? data.customerEmail : undefined,
            specialRequests: typeof data.specialRequests === "string" ? data.specialRequests : undefined,
            createdAt: data.createdAt,
            checkIn: typeof data.checkIn === "string" ? data.checkIn : undefined,
            checkOut: typeof data.checkOut === "string" ? data.checkOut : undefined,
            nights: typeof data.nights === "number" ? data.nights : undefined,
            accomType: typeof data.accomType === "string" ? data.accomType : undefined,
            accomTypeLabel: typeof data.accomTypeLabel === "string" ? data.accomTypeLabel : undefined,
            pricePerNight: typeof data.pricePerNight === "number" ? data.pricePerNight : undefined,
            estimatedTotal: typeof data.estimatedTotal === "number" ? data.estimatedTotal : undefined,
          };
        }).sort((a, b) => b.rawDate.localeCompare(a.rawDate));
        setAccomBookings(mapped);
        setAccomLoaded(true);
      },
      (err) => {
        console.error(err);
        setBookingError("Could not load accommodation bookings. Check Firebase rules.");
        setAccomLoaded(true);
      }
    );

    return () => {
      unsubTours();
      unsubAccom();
    };
  }, [user]);

  /* Live Firestore listener — contact messages */
  useEffect(() => {
    if (!user) return;
    const unsubContacts = onSnapshot(
      collection(db, "contactMessages"),
      (snapshot) => {
        const mapped: ContactMessage[] = snapshot.docs.map((d) => {
          const data = d.data();
          const name = typeof data.name === "string" && data.name.trim() ? data.name : "Unknown sender";
          const status: ContactStatus = data.status === "read" || data.status === "resolved" ? data.status : "new";
          const createdAt = data.createdAt as Timestamp | undefined;
          const date = createdAt?.toDate
            ? createdAt.toDate().toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })
            : "—";
          return {
            id: d.id,
            initials: name.split(" ").map((p: string) => p[0] ?? "").join("").slice(0, 2).toUpperCase(),
            name,
            email: typeof data.email === "string" ? data.email : "—",
            phone: typeof data.phone === "string" && data.phone.trim() ? data.phone : undefined,
            message: typeof data.message === "string" ? data.message : "",
            status,
            statusLabel: contactStatusLabel[status],
            date,
            sortKey: createdAt?.toMillis ? createdAt.toMillis() : 0,
            createdAt,
            reference: `MSG-${d.id.slice(0, 6).toUpperCase()}`,
          };
        }).sort((a, b) => b.sortKey - a.sortKey);
        setContactMessages(mapped);
        setContactError("");
        setContactLoaded(true);
      },
      (err) => {
        console.error(err);
        setContactError("Could not load contact messages. Check Firebase rules.");
        setContactLoaded(true);
      }
    );
    return () => unsubContacts();
  }, [user]);

  /* Live Firestore listener — public contact settings */
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(
      doc(db, "siteSettings", "contact"),
      (snapshot) => {
        const data = snapshot.data();
        setContactSettings({
          phone: typeof data?.phone === "string" ? data.phone : defaultContactSettings.phone,
          alternativePhone: typeof data?.alternativePhone === "string" ? data.alternativePhone : defaultContactSettings.alternativePhone,
        });
        setSettingsLoaded(true);
      },
      (err) => {
        console.error(err);
        setSettingsLoaded(true);
        showToast("Could not load contact settings.");
      }
    );
    return () => unsubscribe();
  }, [user]);

  /* Active booking list based on view (contact view uses its own list) */
  const activeBookings = useMemo(() => {
    if (view === "tours") return tourBookings;
    if (view === "accommodation") return accomBookings;
    return [...tourBookings, ...accomBookings].sort((a, b) => b.rawDate.localeCompare(a.rawDate));
  }, [view, tourBookings, accomBookings]);

  /* Stats from active booking list */
  const stats = useMemo(() => {
    const total = activeBookings.length;
    const pending = activeBookings.filter((b) => b.status === "pending").length;
    const confirmed = activeBookings.filter((b) => b.status === "confirmed").length;
    const revenue = activeBookings.reduce((sum, b) => {
      const num = parseInt(b.amount.replace(/[^0-9]/g, ""), 10);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
    return {
      total: total.toString(),
      pending: pending.toString(),
      confirmed: confirmed.toString(),
      revenue: revenue > 0 ? `R ${revenue.toLocaleString("en-ZA")}` : "R 0",
    };
  }, [activeBookings]);

  /* Stats — contact view */
  const contactStats = useMemo(() => {
    const total = contactMessages.length;
    const fresh = contactMessages.filter((m) => m.status === "new").length;
    const read = contactMessages.filter((m) => m.status === "read").length;
    const resolved = contactMessages.filter((m) => m.status === "resolved").length;
    return { total: total.toString(), fresh: fresh.toString(), read: read.toString(), resolved: resolved.toString() };
  }, [contactMessages]);

  /* Whether the currently active view's data has finished its first load */
  const bookingsLoading = useMemo(() => {
    if (view === "tours") return !toursLoaded;
    if (view === "accommodation") return !accomLoaded;
    return !(toursLoaded && accomLoaded);
  }, [view, toursLoaded, accomLoaded]);

  /* Search filter — bookings */
  const filteredBookings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return activeBookings;
    return activeBookings.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.title.toLowerCase().includes(q) ||
        b.date.toLowerCase().includes(q) ||
        b.statusLabel.toLowerCase().includes(q) ||
        (b.reference && b.reference.toLowerCase().includes(q)) ||
        false
    );
  }, [activeBookings, searchQuery]);

  /* Search filter — contact messages */
  const filteredMessages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return contactMessages;
    return contactMessages.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q) ||
        m.date.toLowerCase().includes(q) ||
        m.statusLabel.toLowerCase().includes(q) ||
        m.reference.toLowerCase().includes(q)
    );
  }, [contactMessages, searchQuery]);

  /* Open booking detail */
  const openDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedMessage(null);
    setDetailOpen(true);
    setConfirmingDelete(false);
  };

  /* Open contact message detail (auto-marks as read) */
  const openMessageDetail = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setSelectedBooking(null);
    setDetailOpen(true);
    setConfirmingDelete(false);
    if (msg.status === "new") {
      updateContactStatus(msg.id, "read", msg);
    }
  };

  /* Close detail */
  const closeDetail = () => {
    setDetailOpen(false);
    setConfirmingDelete(false);
    document.body.style.overflow = "";
    setTimeout(() => {
      setSelectedBooking(null);
      setSelectedMessage(null);
    }, 300);
  };

  /* Map a booking type to its Firestore collection name */
  const collectionFor = (type: BookingType) =>
    type === "tour" ? "bookings" : "accommodationBookings";

  /* Update booking status */
  const updateStatus = async (newStatus: BookingStatus) => {
    if (!selectedBooking || updating) return;
    setUpdating(true);
    try {
      await updateDoc(doc(db, collectionFor(selectedBooking.type), selectedBooking.id), { status: newStatus });
      setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus, statusLabel: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) } : null));
      showToast(`Booking marked ${newStatus}.`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  /* Update contact message status */
  const updateContactStatus = async (id: string, newStatus: ContactStatus, msg?: ContactMessage) => {
    if (updating) return;
    setUpdating(true);
    try {
      await updateDoc(doc(db, "contactMessages", id), { status: newStatus });
      const target = msg ?? selectedMessage;
      if (target && target.id === id) {
        setSelectedMessage({ ...target, status: newStatus, statusLabel: contactStatusLabel[newStatus] });
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update message status.");
    } finally {
      setUpdating(false);
    }
  };

  const saveContactSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    if (settingsSaving) return;
    const phone = contactSettings.phone.trim();
    const alternativePhone = contactSettings.alternativePhone.trim();
    if (!phone) {
      showToast("Enter a primary phone number.");
      return;
    }
    setSettingsSaving(true);
    try {
      await setDoc(doc(db, "siteSettings", "contact"), { phone, alternativePhone }, { merge: true });
      setContactSettings({ phone, alternativePhone });
      showToast("Contact phone numbers updated.", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update contact phone numbers.");
    } finally {
      setSettingsSaving(false);
    }
  };

  /* Delete booking — requires a second click to confirm (see detail-actions UI) */
  const deleteBooking = async () => {
    if (!selectedBooking) return;
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    setUpdating(true);
    try {
      await deleteDoc(doc(db, collectionFor(selectedBooking.type), selectedBooking.id));
      closeDetail();
      showToast("Booking deleted.", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete booking.");
    } finally {
      setUpdating(false);
      setConfirmingDelete(false);
    }
  };

  /* Delete contact message — requires a second click to confirm (see detail-actions UI) */
  const deleteMessage = async () => {
    if (!selectedMessage) return;
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    setUpdating(true);
    try {
      await deleteDoc(doc(db, "contactMessages", selectedMessage.id));
      closeDetail();
      showToast("Message deleted.", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete message.");
    } finally {
      setUpdating(false);
      setConfirmingDelete(false);
    }
  };

  if (authLoading) {
    return <div className="admin-status">Loading admin...</div>;
  }

  if (!user) {
    return (
      <main className="admin-auth">
        <form className="admin-login" onSubmit={handleLogin}>
          <img src="/logo.jpg" alt="Malikan Tours" className="admin-logo" />
          <h1>Malikan Tours Admin</h1>
          <p>Sign in to manage bookings and contact settings.</p>
          <label>Email<input type="email" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} required /></label>
          <label>Password<input type="password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} required /></label>
          {loginError && <strong className="admin-error">{loginError}</strong>}
          <button type="submit" disabled={loginSubmitting}>{loginSubmitting ? "Signing in..." : "Sign in"}</button>
        </form>
        <style jsx>{adminStyles}</style>
      </main>
    );
  }

  const title = view === "all" ? "All Bookings" : view === "tours" ? "Tour Bookings" : view === "accommodation" ? "Accommodation" : view === "contact" ? "Contact Messages" : "Site Settings";
  const chooseView = (nextView: ViewMode) => {
    setView(nextView);
    setSidebarOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="admin-shell">
      <aside id="admin-sidebar" className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="admin-brand">
          <img src="/logo.jpg" alt="" />
          <span>Malikan Tours<small>Admin</small></span>
          <button
            className="admin-sidebar-close"
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {([ ["all", "All Bookings"], ["tours", "Tour Bookings"], ["accommodation", "Accommodation"], ["contact", "Contact Messages"], ["settings", "Site Settings"] ] as const).map(([key, label]) => (
            <button key={key} className={view === key ? "active" : ""} onClick={() => chooseView(key)} type="button">{label}</button>
          ))}
        </nav>
        <button className="admin-logout" type="button" onClick={handleLogout}>Log out</button>
      </aside>
      {sidebarOpen && (
        <button
          className="admin-backdrop"
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu"
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Open admin menu"
            aria-expanded={sidebarOpen}
            aria-controls="admin-sidebar"
          >
            ☰
          </button>
          <h1>{title}</h1>
          {view !== "settings" && <input className="admin-search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search..." aria-label="Search" />}
          <span className="admin-user">{user.email}</span>
        </header>

        <section className="admin-content">
          {view === "settings" ? (
            <article className="admin-card settings-card">
              <h2>Contact phone numbers</h2>
              <p>These numbers appear across the public website.</p>
              <form onSubmit={saveContactSettings} className="settings-form">
                <label>Primary phone<input type="tel" value={contactSettings.phone} onChange={(event) => setContactSettings((current) => ({ ...current, phone: event.target.value }))} required /></label>
                <label>Alternative phone<input type="tel" value={contactSettings.alternativePhone} onChange={(event) => setContactSettings((current) => ({ ...current, alternativePhone: event.target.value }))} /></label>
                <button type="submit" disabled={!settingsLoaded || settingsSaving}>{settingsSaving ? "Saving..." : "Save phone numbers"}</button>
              </form>
            </article>
          ) : view === "contact" ? (
            <article className="admin-card">
              <div className="admin-card-heading"><h2>Contact messages</h2><span>{filteredMessages.length} messages</span></div>
              <div className="admin-list">
                {filteredMessages.map((message) => <button className="admin-row" key={message.id} type="button" onClick={() => openMessageDetail(message)}>
                  <span><strong>{message.name}</strong><small>{message.email}</small></span><span className="row-message">{message.message || "No message"}</span><StatusPill status={message.status} label={message.statusLabel} />
                </button>)}
                {contactLoaded && filteredMessages.length === 0 && <p className="admin-empty">{contactError || "No contact messages found."}</p>}
              </div>
            </article>
          ) : (
            <article className="admin-card">
              <div className="admin-card-heading"><h2>{title}</h2><span>{filteredBookings.length} bookings</span></div>
              <div className="admin-list">
                {filteredBookings.map((booking) => <button className="admin-row" key={`${booking.type}-${booking.id}`} type="button" onClick={() => openDetail(booking)}>
                  <span><strong>{booking.name}</strong><small>{booking.title}</small></span><span>{booking.date}</span><span>{booking.amount}</span><StatusPill status={booking.status} label={booking.statusLabel} />
                </button>)}
                {bookingsLoading && <p className="admin-empty">Loading bookings...</p>}
                {!bookingsLoading && filteredBookings.length === 0 && <p className="admin-empty">{bookingError || "No bookings found."}</p>}
              </div>
            </article>
          )}
        </section>
      </main>

      {detailOpen && (selectedBooking || selectedMessage) && <div className="admin-detail-backdrop" onClick={closeDetail}>
        <aside className="admin-detail" onClick={(event) => event.stopPropagation()}>
          <button className="detail-close" type="button" onClick={closeDetail} aria-label="Close details">×</button>
          {selectedBooking && <>
            <h2>{selectedBooking.name}</h2>
            <p className="detail-subtitle">{selectedBooking.title}</p>
            <div className="detail-status"><StatusPill status={selectedBooking.status} label={selectedBooking.statusLabel} /></div>
            <dl className="detail-grid">
              <DetailField label="Reference" value={selectedBooking.reference} />
              <DetailField label="Customer email" value={selectedBooking.customerEmail ? <a href={`mailto:${selectedBooking.customerEmail}`}>{selectedBooking.customerEmail}</a> : undefined} />
              <DetailField label="Customer phone" value={selectedBooking.customerPhone ? <a href={`tel:${selectedBooking.customerPhone}`}>{selectedBooking.customerPhone}</a> : undefined} />
              <DetailField label="Alternative phone" value={selectedBooking.customerAltPhone ? <a href={`tel:${selectedBooking.customerAltPhone}`}>{selectedBooking.customerAltPhone}</a> : undefined} />
              <DetailField label="Guests" value={selectedBooking.guests} />
              <DetailField label="Booking date" value={selectedBooking.date} />
              <DetailField label="Tour" value={selectedBooking.title} />
              <DetailField label="Price per person" value={selectedBooking.pricePerPerson !== undefined ? `R ${selectedBooking.pricePerPerson.toLocaleString("en-ZA")}` : undefined} />
              <DetailField label="Price per night" value={selectedBooking.pricePerNight !== undefined ? `R ${selectedBooking.pricePerNight.toLocaleString("en-ZA")}` : undefined} />
              <DetailField label="Check-in" value={selectedBooking.checkIn} />
              <DetailField label="Check-out" value={selectedBooking.checkOut} />
              <DetailField label="Nights" value={selectedBooking.nights} />
              <DetailField label="Accommodation" value={selectedBooking.accomTypeLabel || selectedBooking.accomType} />
              <DetailField label="Estimated total" value={selectedBooking.estimatedTotal !== undefined ? `R ${selectedBooking.estimatedTotal.toLocaleString("en-ZA")}` : selectedBooking.amount} />
              <DetailField label="Special requests" value={selectedBooking.specialRequests ? <span className="detail-message">{selectedBooking.specialRequests}</span> : undefined} />
            </dl>
            <div className="detail-actions"><button type="button" onClick={() => updateStatus("confirmed")} disabled={updating}>Confirm</button><button type="button" onClick={() => updateStatus("cancelled")} disabled={updating}>Cancel</button><button type="button" onClick={deleteBooking} disabled={updating}>{confirmingDelete ? "Click again to delete" : "Delete"}</button></div>
          </>}
          {selectedMessage && <>
            <h2>{selectedMessage.name}</h2>
            <p className="detail-subtitle">{selectedMessage.reference}</p>
            <div className="detail-status"><StatusPill status={selectedMessage.status} label={selectedMessage.statusLabel} /></div>
            <dl className="detail-grid">
              <DetailField label="Email" value={<a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>} />
              <DetailField label="Phone" value={selectedMessage.phone ? <a href={`tel:${selectedMessage.phone}`}>{selectedMessage.phone}</a> : undefined} />
              <DetailField label="Received" value={selectedMessage.date} />
              <DetailField label="Message" value={<span className="detail-message">{selectedMessage.message || "No message"}</span>} />
            </dl>
            <div className="detail-actions"><button type="button" onClick={() => updateContactStatus(selectedMessage.id, "resolved")} disabled={updating}>Resolve</button><button type="button" onClick={deleteMessage} disabled={updating}>{confirmingDelete ? "Click again to delete" : "Delete"}</button></div>
          </>}
        </aside>
      </div>}
      {toast && <div className={`admin-toast ${toast.tone}`}>{toast.message}</div>}
      <style jsx>{adminStyles}</style>
    </div>
  );
}

const adminStyles = `
  :global(*) { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  :global(html) { overflow-x: hidden; }
  :global(body) { margin: 0; background: #f5f1e9; color: #201b14; overflow-x: hidden; }
  .admin-shell { min-height: 100vh; display: flex; background: #f5f1e9; overflow-x: hidden; }
  .admin-sidebar { width: 250px; flex: 0 0 250px; min-height: 100vh; padding: 24px 16px; background: #17130d; color: #fff; display: flex; flex-direction: column; gap: 28px; position: sticky; top: 0; }
  .admin-brand { display: flex; align-items: center; gap: 10px; font-weight: 700; } .admin-brand img { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; flex-shrink: 0; } .admin-brand span { min-width: 0; overflow: hidden; text-overflow: ellipsis; } .admin-brand small { display: block; color: #c9a227; font-size: .72rem; margin-top: 3px; }
  .admin-sidebar-close { display: none; }
  .admin-nav { display: grid; gap: 6px; } .admin-nav button, .admin-logout { border: 0; border-radius: 7px; padding: 12px; background: transparent; color: #c9c2b4; text-align: left; cursor: pointer; font: inherit; touch-action: manipulation; } .admin-nav button:hover, .admin-nav button.active { color: #17130d; background: #c9a227; } .admin-nav button:focus-visible, .admin-logout:focus-visible, .admin-menu:focus-visible, .admin-sidebar-close:focus-visible { outline: 2px solid #c9a227; outline-offset: 2px; } .admin-logout { margin-top: auto; border-top: 1px solid #ffffff1c; border-radius: 0; padding-top: 20px; }
  .admin-main { min-width: 0; flex: 1; } .admin-topbar { min-height: 76px; padding: 16px clamp(16px, 4vw, 42px); display: flex; align-items: center; gap: 16px; background: #fffdf9; border-bottom: 1px solid #ded6c8; } .admin-topbar h1 { margin: 0; font: 600 clamp(1.1rem, 2vw, 1.45rem)/1.2 Georgia, serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .admin-search { min-width: 0; flex: 1; max-width: 360px; margin-left: auto; padding: 11px 14px; border: 1px solid #d8d0c3; border-radius: 6px; background: #fff; } .admin-user { max-width: 190px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .8rem; color: #756b5d; flex-shrink: 0; } .admin-menu { display: none; border: 0; background: none; border-radius: 8px; width: 42px; height: 42px; align-items: center; justify-content: center; font-size: 1.4rem; cursor: pointer; touch-action: manipulation; flex-shrink: 0; }
  .admin-content { padding: clamp(16px, 4vw, 42px); } .admin-card { max-width: 1100px; margin: 0 auto; background: #fffdf9; border: 1px solid #ded6c8; border-radius: 10px; overflow: hidden; box-shadow: 0 12px 30px #3927190d; } .admin-card-heading { display: flex; justify-content: space-between; gap: 16px; padding: 22px 24px; border-bottom: 1px solid #ebe5da; } .admin-card h2 { margin: 0; font: 600 1.25rem Georgia, serif; } .admin-card-heading span { color: #756b5d; font-size: .85rem; flex-shrink: 0; } .admin-list { padding: 0 20px; } .admin-row { width: 100%; display: grid; grid-template-columns: minmax(150px, 1.4fr) minmax(120px, 1fr) auto auto; align-items: center; gap: 16px; padding: 18px 4px; border: 0; border-bottom: 1px solid #ebe5da; background: transparent; color: inherit; text-align: left; cursor: pointer; font: inherit; touch-action: manipulation; } .admin-row:last-child { border-bottom: 0; } .admin-row:hover { background: #faf6ee; } .admin-row span { min-width: 0; } .admin-row strong, .admin-row small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .admin-row small { margin-top: 4px; color: #756b5d; font-size: .8rem; } .row-message { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #756b5d; } .admin-empty { padding: 32px 4px; text-align: center; color: #756b5d; }
  .status-pill { display: inline-flex; justify-content: center; padding: 5px 9px; border-radius: 999px; font-size: .72rem; font-weight: 700; white-space: nowrap; } .status-confirmed { background: #dff3e4; color: #217a36; } .status-pending { background: #fff1c9; color: #8a6410; } .status-cancelled { background: #f9dddd; color: #9d3030; } .status-resolved { background: #dcebf8; color: #28658d; }
  .settings-card { padding: clamp(20px, 4vw, 36px); } .settings-card p { color: #756b5d; } .settings-form { display: grid; gap: 16px; max-width: 560px; } .settings-form label, .admin-login label { display: grid; gap: 6px; font-size: .8rem; font-weight: 700; } .settings-form input, .admin-login input { width: 100%; padding: 12px; border: 1px solid #d8d0c3; border-radius: 6px; font: inherit; } .settings-form button, .admin-login button, .detail-actions button { border: 0; border-radius: 6px; padding: 12px 16px; background: #c9a227; color: #17130d; font-weight: 700; cursor: pointer; touch-action: manipulation; } button:disabled { opacity: .55; cursor: not-allowed; }
  .admin-detail-backdrop, .admin-backdrop { position: fixed; inset: 0; background: #17130db3; animation: admin-fade .18s ease; } .admin-backdrop { z-index: 14; border: 0; padding: 0; cursor: pointer; } .admin-detail-backdrop { z-index: 30; } .admin-detail { position: absolute; right: 0; top: 0; height: 100%; height: 100dvh; width: min(440px, 100%); overflow: auto; padding: 32px; background: #fffdf9; box-shadow: -12px 0 30px #17130d22; } .detail-close { float: right; border: 0; background: none; font-size: 1.8rem; cursor: pointer; touch-action: manipulation; } .detail-subtitle { margin: 6px 0 18px; color: #756b5d; } .detail-status { margin-bottom: 20px; } .detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin: 0; } .detail-field { min-width: 0; padding-bottom: 12px; border-bottom: 1px solid #ebe5da; } .detail-field dt { margin-bottom: 5px; color: #756b5d; font-size: .72rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; } .detail-field dd { margin: 0; overflow-wrap: anywhere; line-height: 1.45; } .detail-field a { color: #8a6410; overflow-wrap: anywhere; } .detail-field:last-child { grid-column: 1 / -1; } .detail-message { white-space: pre-wrap; line-height: 1.6; overflow-wrap: anywhere; } .detail-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 24px; } .detail-actions button:last-child { background: #f2dada; color: #8f2929; } .admin-toast { position: fixed; right: 20px; bottom: 20px; z-index: 40; padding: 13px 16px; border-radius: 6px; color: #fff; background: #243b28; } .admin-toast.error { background: #8f2929; }
  .admin-auth, .admin-status { min-height: 100vh; display: grid; place-items: center; padding: 20px; background: #17130d; } .admin-status { color: #fff; } .admin-login { width: min(100%, 380px); display: grid; gap: 16px; padding: 32px; border-radius: 10px; background: #fffdf9; } .admin-login h1 { margin: 0; font: 600 1.4rem Georgia, serif; } .admin-login p { margin: -8px 0 4px; color: #756b5d; } .admin-logo { width: 58px; height: 58px; border-radius: 50%; object-fit: cover; } .admin-error { color: #9d3030; font-size: .85rem; }
  @keyframes admin-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes admin-slide-in { from { transform: translateX(-105%); } to { transform: translateX(0); } }
  @media (max-width: 880px) {
    .admin-sidebar { position: fixed; z-index: 15; left: 0; top: 0; width: min(86vw, 310px); flex-basis: auto; height: 100vh; height: 100dvh; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: max(20px, env(safe-area-inset-top)) 16px max(20px, env(safe-area-inset-bottom)); transform: translateX(-105%); transition: transform .24s ease; box-shadow: 12px 0 30px #17130d55; }
    .admin-sidebar.is-open { transform: translateX(0); }
    .admin-sidebar-close { display: inline-flex; align-items: center; justify-content: center; margin-left: auto; width: 34px; height: 34px; flex-shrink: 0; border: 0; border-radius: 8px; background: rgba(255,255,255,.08); color: #fff; font-size: 1.4rem; line-height: 1; cursor: pointer; touch-action: manipulation; }
    .admin-menu { display: inline-flex; }
    .admin-menu:active, .admin-sidebar-close:active { background: rgba(0,0,0,.08); }
    .admin-nav button, .admin-logout { min-height: 48px; }
    .admin-topbar { flex-wrap: wrap; }
    .admin-topbar h1 { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .admin-search { order: 3; flex-basis: 100%; max-width: none; margin: 0; min-height: 44px; }
    .admin-user { display: none; }
    .admin-row { grid-template-columns: 1fr auto; gap: 8px 12px; }
    .admin-row > :nth-child(2) { grid-column: 1; }
    .admin-row > :nth-child(3), .admin-row > :nth-child(4) { grid-column: 2; grid-row: 1; }
    .row-message { grid-column: 1 / -1; }
  }
  @media (max-width: 480px) {
    .admin-content { padding: 10px; }
    .admin-card-heading, .settings-card { padding: 16px; }
    .admin-list { padding: 0 12px; }
    .admin-detail { padding: 24px 18px; width: 100%; }
    .detail-grid { grid-template-columns: 1fr; gap: 12px; }
    .detail-field:last-child { grid-column: auto; }
    .admin-topbar { gap: 10px; padding-inline: 12px; }
    .admin-topbar h1 { font-size: 1rem; }
    .detail-actions button { flex: 1 1 auto; }
  }
  @media (prefers-reduced-motion: reduce) {
    .admin-sidebar, .admin-backdrop, .admin-detail-backdrop { animation: none !important; transition: none !important; }
  }
`;