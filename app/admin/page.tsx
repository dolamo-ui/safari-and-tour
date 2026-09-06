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

/* ========================================================================   Malikan Tours — Admin Bookings (Tours + Accommodation + Shuttle + Contact)   ======================================================================== */

type BookingStatus = "confirmed" | "pending" | "cancelled";
type BookingType = "tour" | "accommodation" | "shuttle";
type ViewMode = "all" | "tours" | "accommodation" | "shuttle" | "contact" | "settings";
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
  // shuttle specific
  route?: string;
  routeLabel?: string;
  transferDate?: string;
  transferTime?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
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

function ShuttleIcon() {
  return (
    <svg width="20" height="20" {...svgBase}>
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
      <circle cx="6.5" cy="16.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
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
  const [shuttleBookings, setShuttleBookings] = useState<Booking[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [toursLoaded, setToursLoaded] = useState(false);
  const [accomLoaded, setAccomLoaded] = useState(false);
  const [shuttleLoaded, setShuttleLoaded] = useState(false);
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

  /* Lightweight themed toast — replaces alert() */
  const showToast = (message: string, tone: "error" | "success" = "error") => {
    setToast({ message, tone });
  };
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  /* Live Firestore listeners — tours + accommodation + shuttle */
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

    const unsubShuttle = onSnapshot(
      collection(db, "shuttleBookings"),
      (snapshot) => {
        const mapped = snapshot.docs.map((d) => {
          const data = d.data();
          const name = typeof data.customerName === "string" ? data.customerName : "Unknown customer";
          const status = data.status === "confirmed" || data.status === "cancelled" ? data.status : "pending";
          const amount = typeof data.estimatedTotal === "number" ? `R ${data.estimatedTotal.toLocaleString("en-ZA")}` : "—";
          const rawDate = typeof data.transferDate === "string" ? data.transferDate : "";
          return {
            id: d.id,
            type: "shuttle" as const,
            initials: name.split(" ").map((p: string) => p[0] ?? "").join("").slice(0, 2).toUpperCase(),
            avatarGradient: "linear-gradient(135deg, #3568b3, #59a5e6)",
            name,
            title: typeof data.routeLabel === "string" ? data.routeLabel : "Shuttle Transfer",
            date: rawDate ? new Date(rawDate).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" }) : "—",
            status,
            statusLabel: status.charAt(0).toUpperCase() + status.slice(1),
            amount,
            rawDate,
            reference: typeof data.reference === "string" ? data.reference : undefined,
            guests: typeof data.passengers === "number" ? data.passengers : undefined,
            customerPhone: typeof data.customerPhone === "string" ? data.customerPhone : undefined,
            customerEmail: typeof data.customerEmail === "string" ? data.customerEmail : undefined,
            specialRequests: typeof data.specialRequests === "string" ? data.specialRequests : undefined,
            createdAt: data.createdAt,
            route: typeof data.route === "string" ? data.route : undefined,
            routeLabel: typeof data.routeLabel === "string" ? data.routeLabel : undefined,
            transferDate: typeof data.transferDate === "string" ? data.transferDate : undefined,
            transferTime: typeof data.transferTime === "string" ? data.transferTime : undefined,
            pickupLocation: typeof data.pickupLocation === "string" ? data.pickupLocation : undefined,
            dropoffLocation: typeof data.dropoffLocation === "string" ? data.dropoffLocation : undefined,
            pricePerPerson: typeof data.pricePerPerson === "number" ? data.pricePerPerson : undefined,
            estimatedTotal: typeof data.estimatedTotal === "number" ? data.estimatedTotal : undefined,
          };
        }).sort((a, b) => b.rawDate.localeCompare(a.rawDate));
        setShuttleBookings(mapped);
        setShuttleLoaded(true);
      },
      (err) => {
        console.error(err);
        setBookingError("Could not load shuttle bookings. Check Firebase rules.");
        setShuttleLoaded(true);
      }
    );

    return () => {
      unsubTours();
      unsubAccom();
      unsubShuttle();
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
    if (view === "shuttle") return shuttleBookings;
    return [...tourBookings, ...accomBookings, ...shuttleBookings].sort((a, b) => b.rawDate.localeCompare(a.rawDate));
  }, [view, tourBookings, accomBookings, shuttleBookings]);

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
    if (view === "shuttle") return !shuttleLoaded;
    return !(toursLoaded && accomLoaded && shuttleLoaded);
  }, [view, toursLoaded, accomLoaded, shuttleLoaded]);

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
        (b.pickupLocation && b.pickupLocation.toLowerCase().includes(q)) ||
        (b.dropoffLocation && b.dropoffLocation.toLowerCase().includes(q))
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
    type === "tour" ? "bookings" : type === "accommodation" ? "accommodationBookings" : "shuttleBookings";

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
 }
}