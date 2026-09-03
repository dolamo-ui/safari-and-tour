"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { db, auth } from "../lib/firebase";

/* ========================================================================   Malikan Tours — Admin Bookings (Tours + Accommodation + Shuttle + Contact)   ======================================================================== */

type BookingStatus = "confirmed" | "pending" | "cancelled";
type BookingType = "tour" | "accommodation" | "shuttle";
type ViewMode = "all" | "tours" | "accommodation" | "shuttle" | "contact";
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

  /* Scroll reveal */
  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filteredBookings, filteredMessages]);

  /* Close detail panel on Escape */
  useEffect(() => {
    if (!detailOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDetail();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [detailOpen]);

  /* Close sidebar on desktop resize */
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) setSidebarOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Lock body scroll */
  useEffect(() => {
    if (!detailOpen) {
      document.body.style.overflow = sidebarOpen ? "hidden" : "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen, detailOpen]);

  const createdDate = selectedBooking?.createdAt?.toDate
    ? selectedBooking.createdAt.toDate().toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";

  const messageCreatedDate = selectedMessage?.createdAt?.toDate
    ? selectedMessage.createdAt.toDate().toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";

  const navItems: { key: ViewMode; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "All Bookings", icon: <BookingsIcon /> },
    { key: "tours", label: "Tour Bookings", icon: <TourIcon /> },
    { key: "accommodation", label: "Accommodation", icon: <BedIcon /> },
    { key: "shuttle", label: "Shuttle Transfers", icon: <ShuttleIcon /> },
    { key: "contact", label: "Contact Messages", icon: <MessageIcon /> },
  ];

  const viewTitle =
    view === "all"
      ? "All Bookings"
      : view === "tours"
      ? "Tour Bookings"
      : view === "accommodation"
      ? "Accommodation"
      : view === "shuttle"
      ? "Shuttle Transfers"
      : "Contact Messages";

  const viewHeading =
    view === "all"
      ? "Booking Management"
      : view === "tours"
      ? "Tour Reservations"
      : view === "accommodation"
      ? "Accommodation Requests"
      : view === "shuttle"
      ? "Shuttle Transfer Requests"
      : "Contact Messages";

  const viewSub =
    view === "all"
      ? "Live view of every tour, accommodation, and shuttle reservation."
      : view === "tours"
      ? "Live view of tour bookings from your site."
      : view === "accommodation"
      ? "Live view of accommodation requests from your site."
      : view === "shuttle"
      ? "Live view of shuttle transfer requests from your site."
      : "Messages sent through the Contact Us form on your site.";

  const typeLabel = (type: BookingType) => (type === "tour" ? "Tour" : type === "accommodation" ? "Stay" : "Shuttle");

  const adminEmail = user?.email ?? "Admin";
  const adminInitial = adminEmail.charAt(0).toUpperCase();

  /* Still checking auth state — avoid flashing the login form or dashboard */
  if (authLoading) {
    return (
      <div className="auth-screen">
        <p>Loading…</p>
        <style jsx global>{`
          .auth-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #14110b; color: #c9c2b4; font: 14px Arial, sans-serif; }
        `}</style>
      </div>
    );
  }

  /* Not signed in — show the login form instead of the dashboard */
  if (!user) {
    return (
      <div className="auth-screen">
        <form className="login-card" onSubmit={handleLogin}>
          <div className="login-mark">
            <img src="/logo.jpg" alt="Malikan Tours" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <h1>Malikan Tours Admin</h1>
          <p className="login-sub">Sign in to manage bookings and messages.</p>

          <label className="login-field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="username"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="you@malikantours.co.za"
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {loginError && <p className="login-error">{loginError}</p>}

          <button type="submit" className="login-btn" disabled={loginSubmitting}>
            <LockIcon />
            {loginSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <style jsx global>{`
          .auth-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #14110b; padding: 24px; font: 14px/1.6 Arial, sans-serif; }
          .login-card { width: 100%; max-width: 360px; background: #1c1810; border: 1px solid rgba(201,162,39,.2); border-radius: 12px; padding: 32px 28px; text-align: center; }
          .login-mark { width: 52px; height: 52px; margin: 0 auto 16px; border-radius: 50%; overflow: hidden; }
          .login-card h1 { margin: 0 0 6px; font: 400 1.3rem Georgia, serif; color: #fff; }
          .login-sub { margin: 0 0 24px; color: #8c8477; font-size: .85rem; }
          .login-field { display: block; text-align: left; margin-bottom: 16px; }
          .login-field span { display: block; margin-bottom: 6px; font-size: .78rem; color: #c9c2b4; text-transform: uppercase; letter-spacing: .04em; }
          .login-field input { width: 100%; padding: 10px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,.14); background: #14110b; color: #fff; outline: 0; box-sizing: border-box; }
          .login-field input:focus { border-color: #c9a227; }
          .login-error { margin: -6px 0 16px; color: #f0908f; font-size: .82rem; text-align: left; }
          .login-btn { width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 14px; border: 0; border-radius: 6px; background: #c9a227; color: #14110b; font-weight: 700; cursor: pointer; }
          .login-btn:disabled { opacity: .6; cursor: default; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-mark">
            <img src="/logo.jpg" alt="Malikan Tours" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div className="brand-text">
            <span className="brand-name">Malikan Tours</span>
            <span className="brand-sub">Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`nav-item${view === item.key ? " active" : ""}`}
                onClick={() => {
                  setView(item.key);
                  setSidebarOpen(false);
                }}
              >
                {item.icon}
                {item.label}
                {item.key === "contact" && contactStats.fresh !== "0" && (
                  <span className="nav-badge">{contactStats.fresh}</span>
                )}
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="logout-btn" onClick={handleLogout}>
            <LogoutIcon />
            Logout
          </button>
        </div>
      </aside>

      <div className={`sidebar-overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className="main-content">
        <header className="topbar">
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <h1 className="topbar-title">{viewTitle}</h1>
          <div className="topbar-actions">
            <div className="search-box">
              <SearchIcon />
              <input
                type="text"
                placeholder={view === "contact" ? "Search name, email, message…" : "Search name, tour, date, status…"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="icon-btn"
              aria-label={contactStats.fresh !== "0" ? `${contactStats.fresh} new contact messages` : "Notifications"}
              onClick={() => setView("contact")}
            >
              <BellIcon />
              {contactStats.fresh !== "0" && <span className="badge">{contactStats.fresh}</span>}
            </button>
            <div className="user-pill">
              <div className="user-avatar">{adminInitial}</div>
              <span style={{ fontSize: ".85rem", fontWeight: 600, color: "var(--ink)" }} title={adminEmail}>{adminEmail}</span>
            </div>
          </div>
        </header>

        <div className="page-content">
          <div className="reveal">
            <h2 className="section-title">{viewHeading}</h2>
            <p className="section-sub">{viewSub} Click any row to see full details.</p>
          </div>

          {/* Live stats — bookings views */}
          {view !== "contact" && (
            <div className="stats-row">
              <div className="stat-card reveal">
                <div className="stat-header">
                  <div className="stat-icon"><BookingsIcon /></div>
                  <span className="stat-trend trend-up">Live</span>
                </div>
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total</div>
              </div>

              <div className="stat-card reveal">
                <div className="stat-header">
                  <div className="stat-icon" style={{ background: "rgba(34,197,94,.1)", color: "#16a34a" }}>
                    <TrendUpIcon />
                  </div>
                  <span className="stat-trend trend-up">Active</span>
                </div>
                <div className="stat-value">{stats.confirmed}</div>
                <div className="stat-label">Confirmed</div>
              </div>

              <div className="stat-card reveal">
                <div className="stat-header">
                  <div className="stat-icon" style={{ background: "rgba(201,162,39,.12)", color: "var(--gold)" }}>
                    <TrendDownIcon />
                  </div>
                  <span className="stat-trend trend-pending">Awaiting</span>
                </div>
                <div className="stat-value">{stats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>

              <div className="stat-card reveal">
                <div className="stat-header">
                  <div className="stat-icon" style={{ background: "rgba(169,121,28,.1)", color: "var(--gold)" }}>
                    <svg width="22" height="22" {...svgBase}>
                      <line x1="12" x2="12" y1="2" y2="22" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <span className="stat-trend trend-up">Est.</span>
                </div>
                <div className="stat-value" style={{ fontSize: "1.5rem" }}>{stats.revenue}</div>
                <div className="stat-label">Revenue</div>
              </div>
            </div>
          )}

          {/* Live stats — contact view */}
          {view === "contact" && (
            <div className="stats-row">
              <div className="stat-card reveal">
                <div className="stat-header">
                  <div className="stat-icon"><MessageIcon /></div>
                  <span className="stat-trend trend-up">Live</span>
                </div>
                <div className="stat-value">{contactStats.total}</div>
                <div className="stat-label">Total Messages</div>
              </div>

              <div className="stat-card reveal">
                <div className="stat-header">
                  <div className="stat-icon" style={{ background: "rgba(201,162,39,.12)", color: "var(--gold)" }}>
                    <BellIcon />
                  </div>
                  <span className="stat-trend trend-pending">Unread</span>
                </div>
                <div className="stat-value">{contactStats.fresh}</div>
                <div className="stat-label">New</div>
              </div>

              <div className="stat-card reveal">
                <div className="stat-header">
                  <div className="stat-icon" style={{ background: "rgba(34,197,94,.1)", color: "#16a34a" }}>
                    <MailIcon />
                  </div>
                  <span className="stat-trend trend-up">Seen</span>
                </div>
                <div className="stat-value">{contactStats.read}</div>
                <div className="stat-label">Read</div>
              </div>

              <div className="stat-card reveal">
                <div className="stat-header">
                  <div className="stat-icon" style={{ background: "rgba(29,111,168,.1)", color: "#1d6fa8" }}>
                    <CheckIcon />
                  </div>
                  <span className="stat-trend trend-up">Done</span>
                </div>
                <div className="stat-value">{contactStats.resolved}</div>
                <div className="stat-label">Resolved</div>
              </div>
            </div>
          )}

          {/* Bookings table — bookings views */}
          {view !== "contact" && (
            <div className="card reveal">
              <div className="card-header">
                <h3 className="card-title">{viewTitle}</h3>
                <span style={{ fontSize: ".8rem", color: "var(--ink-faint)" }}>
                  {filteredBookings.length} record{filteredBookings.length !== 1 ? "s" : ""} shown
                </span>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {view === "all" && <th style={{ width: "90px" }}>Type</th>}
                        <th>Customer</th>
                        <th>{view === "accommodation" ? "Accommodation" : view === "shuttle" ? "Route" : "Tour"}</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th style={{ textAlign: "right" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking) => (
                        <tr
                          key={`${booking.type}-${booking.id}`}
                          onClick={() => openDetail(booking)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openDetail(booking);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label={`View booking for ${booking.name}, ${booking.title}`}
                          style={{ cursor: "pointer" }}
                        >
                          {view === "all" && (
                            <td data-label="Type">
                              <span className={`type-badge ${booking.type}`}>{typeLabel(booking.type)}</span>
                            </td>
                          )}
                          <td data-label="Customer">
                            <div className="customer-cell">
                              <div className="customer-avatar" style={{ background: booking.avatarGradient }}>
                                {booking.initials}
                              </div>
                              <span style={{ color: "var(--ink)", fontWeight: 500 }}>{booking.name}</span>
                            </div>
                          </td>
                          <td data-label={view === "accommodation" ? "Accommodation" : view === "shuttle" ? "Route" : "Tour"}>{booking.title}</td>
                          <td data-label="Date">{booking.date}</td>
                          <td data-label="Status">
                            <StatusPill status={booking.status} label={booking.statusLabel} />
                          </td>
                          <td data-label="Amount" style={{ fontWeight: 600, color: "var(--ink)", textAlign: "right" }}>
                            {booking.amount}
                          </td>
                        </tr>
                      ))}
                      {bookingsLoading && filteredBookings.length === 0 && (
                        <tr className="skeleton-row"><td colSpan={view === "all" ? 6 : 5}>Loading bookings…</td></tr>
                      )}
                      {!bookingsLoading && filteredBookings.length === 0 && (
                        <tr>
                          <td colSpan={view === "all" ? 6 : 5} style={{ textAlign: "center", padding: 40 }}>
                            {bookingError || (searchQuery ? "No bookings match your search." : "No bookings received yet.")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Contact messages table */}
          {view === "contact" && (
            <div className="card reveal">
              <div className="card-header">
                <h3 className="card-title">Contact Messages</h3>
                <span style={{ fontSize: ".8rem", color: "var(--ink-faint)" }}>
                  {filteredMessages.length} message{filteredMessages.length !== 1 ? "s" : ""} shown
                </span>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Sender</th>
                        <th>Message</th>
                        <th>Received</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMessages.map((msg) => (
                        <tr
                          key={msg.id}
                          onClick={() => openMessageDetail(msg)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openMessageDetail(msg);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label={`View message from ${msg.name}`}
                          style={{ cursor: "pointer", fontWeight: msg.status === "new" ? 600 : 400 }}
                        >
                          <td data-label="Sender">
                            <div className="customer-cell">
                              <div className="customer-avatar" style={{ background: "linear-gradient(135deg, #8f671a, #c9a227)" }}>
                                {msg.initials}
                              </div>
                              <div>
                                <div style={{ color: "var(--ink)", fontWeight: msg.status === "new" ? 600 : 500 }}>{msg.name}</div>
                                <div style={{ fontSize: ".78rem", color: "var(--ink-faint)", fontWeight: 400 }}>{msg.email}</div>
                              </div>
                            </div>
                          </td>
                          <td data-label="Message" style={{ maxWidth: "420px", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {msg.message.length > 90 ? msg.message.slice(0, 90) + "…" : msg.message}
                          </td>
                          <td data-label="Received">{msg.date}</td>
                          <td data-label="Status">
                            <StatusPill status={msg.status} label={msg.statusLabel} />
                          </td>
                        </tr>
                      ))}
                      {!contactLoaded && filteredMessages.length === 0 && (
                        <tr className="skeleton-row"><td colSpan={4}>Loading messages…</td></tr>
                      )}
                      {contactLoaded && filteredMessages.length === 0 && (
                        <tr>
                          <td colSpan={4} style={{ textAlign: "center", padding: 40 }}>
                            {contactError || (searchQuery ? "No messages match your search." : "No contact messages received yet.")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="admin-footer">
          <span>© 2026 Malikan Tours And Projects (Pty) Ltd. Admin Portal.</span>
          <span>Live booking management</span>
        </footer>
      </main>

      {/* Booking detail panel */}
      {detailOpen && selectedBooking && (
        <div className="detail-overlay" onClick={closeDetail} role="presentation">
          <section className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="booking-detail-title" onClick={(event) => event.stopPropagation()}>
            <div className="detail-header">
              <div>
                <span className={`type-badge ${selectedBooking.type}`}>
                  {selectedBooking.type === "tour" ? "Tour booking" : selectedBooking.type === "accommodation" ? "Accommodation" : "Shuttle transfer"}
                </span>
                <h2 id="booking-detail-title">{selectedBooking.name}</h2>
                <p>{selectedBooking.reference || "No reference number"}</p>
              </div>
              <button type="button" className="icon-btn" onClick={closeDetail} aria-label="Close booking details">
                <CloseIcon />
              </button>
            </div>

            <div className="detail-body">
              <div className="detail-summary">
                <strong>{selectedBooking.title}</strong>
                <StatusPill status={selectedBooking.status} label={selectedBooking.statusLabel} />
              </div>
              <p className="detail-created">Received {createdDate}</p>
              <dl className="detail-grid">
                <div><dt>Date</dt><dd>{selectedBooking.date}</dd></div>
                <div><dt>{selectedBooking.type === "shuttle" ? "Passengers" : "Guests"}</dt><dd>{selectedBooking.guests ?? "—"}</dd></div>
                <div><dt>Amount</dt><dd>{selectedBooking.amount}</dd></div>
                {selectedBooking.type === "accommodation" && <div><dt>Nights</dt><dd>{selectedBooking.nights ?? "—"}</dd></div>}
                {selectedBooking.type === "shuttle" && <div><dt>Transfer Time</dt><dd>{selectedBooking.transferTime ?? "—"}</dd></div>}
                {selectedBooking.type === "shuttle" && (
                  <div>
                    <dt>Pickup</dt>
                    <dd><MapPinIcon /> {selectedBooking.pickupLocation ?? "—"}</dd>
                  </div>
                )}
                {selectedBooking.type === "shuttle" && (
                  <div>
                    <dt>Drop-off</dt>
                    <dd><MapPinIcon /> {selectedBooking.dropoffLocation ?? "—"}</dd>
                  </div>
                )}
                <div><dt>Phone</dt><dd><a href={`tel:${selectedBooking.customerPhone || ""}`}><PhoneIcon /> {selectedBooking.customerPhone || "—"}</a></dd></div>
                <div><dt>Email</dt><dd><a href={`mailto:${selectedBooking.customerEmail || ""}`}><MailIcon /> {selectedBooking.customerEmail || "—"}</a></dd></div>
              </dl>
              <div className="detail-notes">
                <dt>Special requests</dt>
                <dd>{selectedBooking.specialRequests || "No special requests."}</dd>
              </div>
            </div>

            <div className="detail-actions">
              <button
                type="button"
                className={`btn btn-danger${confirmingDelete ? " confirming" : ""}`}
                onClick={deleteBooking}
                onBlur={() => setConfirmingDelete(false)}
                disabled={updating}
              >
                {confirmingDelete ? "Confirm delete?" : "Delete"}
              </button>
              <div className="status-actions">
                <button type="button" className="btn btn-ghost" onClick={() => updateStatus("cancelled")} disabled={updating}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => updateStatus("confirmed")} disabled={updating}>Confirm</button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Contact message detail panel */}
      {detailOpen && selectedMessage && (
        <div className="detail-overlay" onClick={closeDetail} role="presentation">
          <section className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="message-detail-title" onClick={(event) => event.stopPropagation()}>
            <div className="detail-header">
              <div>
                <span className="type-badge contact">Contact message</span>
                <h2 id="message-detail-title">{selectedMessage.name}</h2>
                <p>{selectedMessage.reference}</p>
              </div>
              <button type="button" className="icon-btn" onClick={closeDetail} aria-label="Close message details">
                <CloseIcon />
              </button>
            </div>

            <div className="detail-body">
              <div className="detail-summary">
                <strong>{selectedMessage.email}</strong>
                <StatusPill status={selectedMessage.status} label={selectedMessage.statusLabel} />
              </div>
              <p className="detail-created">Received {messageCreatedDate}</p>
              <dl className="detail-grid">
                <div><dt>Email</dt><dd><a href={`mailto:${selectedMessage.email}`}><MailIcon /> {selectedMessage.email}</a></dd></div>
                <div><dt>Phone</dt><dd>{selectedMessage.phone ? <a href={`tel:${selectedMessage.phone}`}><PhoneIcon /> {selectedMessage.phone}</a> : "—"}</dd></div>
              </dl>
              <div className="detail-notes">
                <dt>Message</dt>
                <dd style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{selectedMessage.message || "No message content."}</dd>
              </div>
            </div>

            <div className="detail-actions">
              <button
                type="button"
                className={`btn btn-danger${confirmingDelete ? " confirming" : ""}`}
                onClick={deleteMessage}
                onBlur={() => setConfirmingDelete(false)}
                disabled={updating}
              >
                {confirmingDelete ? "Confirm delete?" : "Delete"}
              </button>
              <div className="status-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => updateContactStatus(selectedMessage.id, "read")}
                  disabled={updating || selectedMessage.status === "read"}
                >
                  Mark as Read
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => updateContactStatus(selectedMessage.id, "resolved")}
                  disabled={updating || selectedMessage.status === "resolved"}
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Toast — replaces alert() for status/delete feedback */}
      {toast && (
        <div className={`toast toast-${toast.tone}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      )}

      <style jsx global>{`
        :root {
          --bg: #ffffff;
          --bg-warm: #faf7f0;
          --bg-dark: #14110b;
          --ink: #14110b;
          --ink-dim: #5a5346;
          --ink-faint: #8c8477;
          --gold: #a9791c;
          --gold-bright: #c9a227;
          --line: rgba(20, 17, 11, 0.1);
          --sidebar-width: 260px;
          /* Semantic z-index scale — avoid arbitrary stacking values */
          --z-sticky: 10;
          --z-sidebar: 20;
          --z-overlay: 40;
          --z-modal: 50;
          --z-toast: 60;
        }
        .admin-layout { display: flex; min-height: 100vh; color: var(--ink); background: var(--bg-warm); font: 14px/1.6 Arial, sans-serif; }
        .admin-layout button, .admin-layout input { font: inherit; }
        .sidebar { width: var(--sidebar-width); position: fixed; inset: 0 auto 0 0; z-index: var(--z-sidebar); display: flex; flex-direction: column; background: var(--bg-dark); color: #fff; }
        .sidebar-header, .sidebar-footer { padding: 24px; border-bottom: 1px solid rgba(255,255,255,.12); }
        .sidebar-footer { border-top: 1px solid rgba(255,255,255,.12); border-bottom: 0; }
        .brand-mark, .customer-avatar, .user-avatar { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; overflow: hidden; }
        .brand-mark { width: 38px; height: 38px; vertical-align: middle; margin-right: 10px; }
        .brand-text { display: inline-flex; flex-direction: column; vertical-align: middle; }
        .brand-name { font-size: 1.05rem; }
        .brand-sub { color: var(--gold-bright); font-size: .7rem; text-transform: uppercase; letter-spacing: .12em; }
        .sidebar-nav { flex: 1; padding: 20px 16px; }
        .nav-item, .logout-btn { width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 0; border-radius: 6px; background: transparent; color: #c9c2b4; text-align: left; cursor: pointer; }
        .nav-item:hover, .nav-item.active { background: rgba(201,162,39,.16); color: var(--gold-bright); }
        .nav-badge { margin-left: auto; background: var(--gold-bright); color: #14110b; font-size: .68rem; font-weight: 700; min-width: 20px; height: 20px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; padding: 0 6px; }
        .sidebar-overlay { position: fixed; inset: 0; z-index: var(--z-overlay); background: rgba(0,0,0,.4); opacity: 0; pointer-events: none; transition: opacity .2s ease; }
        .sidebar-overlay.open { opacity: 1; pointer-events: auto; }
        .main-content { flex: 1; min-width: 0; margin-left: var(--sidebar-width); }
        .topbar { height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; background: #fff; border-bottom: 1px solid var(--line); }
        .topbar-title, .section-title, .card-title { font-family: Georgia, serif; font-weight: 400; }
        .topbar-actions, .search-box, .user-pill, .detail-summary, .detail-actions, .status-actions { display: flex; align-items: center; gap: 12px; }
        .search-box { padding: 8px 12px; background: var(--bg-warm); border: 1px solid var(--line); border-radius: 6px; }
        .search-box input { width: 230px; border: 0; outline: 0; background: transparent; }
        .icon-btn { width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--line); border-radius: 50%; background: #fff; cursor: pointer; }
        .user-avatar { width: 30px; height: 30px; color: #fff; background: var(--gold); flex-shrink: 0; }
        .user-pill span { max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .page-content { padding: 32px; }
        .section-sub { color: var(--ink-dim); margin: 0 0 28px; }
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
        .stat-card, .card { background: #fff; border: 1px solid var(--line); border-radius: 8px; }
        .stat-card { padding: 20px; }
        .stat-header, .card-header { display: flex; align-items: center; justify-content: space-between; }
        .stat-icon { width: 42px; height: 42px; display: grid; place-items: center; color: var(--gold); background: rgba(169,121,28,.1); border-radius: 10px; }
        .stat-value { margin-top: 14px; font: 1.7rem Georgia, serif; }
        .stat-label, .activity-time { color: var(--ink-faint); font-size: .82rem; }
        .card-header { padding: 20px 24px; border-bottom: 1px solid var(--line); }
        .card-body { padding: 20px 24px; }
        .table-wrap { overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { padding: 14px 16px; border-bottom: 1px solid var(--line); text-align: left; white-space: nowrap; }
        .data-table th { color: var(--ink-faint); font-size: .72rem; text-transform: uppercase; }
        .customer-cell { display: flex; align-items: center; gap: 10px; }
        .customer-avatar { width: 32px; height: 32px; color: #fff; font-size: .75rem; flex-shrink: 0; }
        .type-badge, .status-pill { display: inline-flex; align-items: center; padding: 4px 9px; border-radius: 999px; font-size: .75rem; font-weight: 600; }
        .type-badge.tour { color: #8f671a; background: rgba(201,162,39,.12); }
        .type-badge.accommodation { color: #347347; background: rgba(74,124,89,.12); }
        .type-badge.shuttle { color: #2a5aa0; background: rgba(53,104,179,.12); }
        .type-badge.contact { color: #1d6fa8; background: rgba(29,111,168,.12); }
        .status-confirmed { color: #16803b; background: rgba(34,197,94,.1); }
        .status-pending { color: var(--gold); background: rgba(201,162,39,.12); }
        .status-cancelled { color: #c32626; background: rgba(239,68,68,.1); }
        .status-resolved { color: #1d6fa8; background: rgba(29,111,168,.1); }
        .btn { padding: 9px 14px; border: 1px solid transparent; border-radius: 4px; cursor: pointer; font-weight: 600; }
        .btn-primary { color: #fff; background: var(--gold); }
        .btn-ghost { color: var(--ink-dim); background: #fff; border-color: var(--line); }
        .btn-danger { color: #c32626; background: rgba(239,68,68,.08); }
        .btn-danger.confirming { color: #fff; background: #c32626; }
        .toast { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: var(--z-toast); padding: 12px 20px; border-radius: 8px; font-size: .85rem; font-weight: 600; color: #fff; box-shadow: 0 12px 30px rgba(0,0,0,.2); }
        .toast-error { background: #c32626; }
        .toast-success { background: #16803b; }
        .skeleton-row td { text-align: center; padding: 40px; color: var(--ink-faint); }
        .admin-footer { display: flex; justify-content: space-between; gap: 12px; padding: 24px 32px; color: var(--ink-faint); font-size: .8rem; border-top: 1px solid var(--line); background: #fff; }
        .detail-overlay { position: fixed; inset: 0; z-index: var(--z-modal); display: flex; justify-content: flex-end; background: rgba(0,0,0,.48); }
        .detail-panel { width: min(560px, 100%); height: 100%; overflow-y: auto; background: #fff; box-shadow: -12px 0 40px rgba(0,0,0,.18); }
        .detail-header, .detail-body, .detail-actions { padding: 24px; }
        .detail-header { display: flex; justify-content: space-between; border-bottom: 1px solid var(--line); }
        .detail-header h2 { margin: 14px 0 2px; font: 1.5rem Georgia, serif; }
        .detail-header p { margin: 0; color: var(--ink-faint); }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin: 24px 0; }
        .detail-grid dt, .detail-notes dt { color: var(--ink-faint); font-size: .75rem; text-transform: uppercase; }
        .detail-grid dd, .detail-notes dd { margin: 4px 0 0; }
        .detail-grid a { display: inline-flex; align-items: center; gap: 6px; color: var(--gold); }
        .detail-grid dd svg { flex-shrink: 0; }
        .detail-notes { padding-top: 18px; border-top: 1px solid var(--line); }
        .detail-actions { justify-content: space-between; border-top: 1px solid var(--line); }
        .mobile-toggle { display: none; }
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); transition: transform .2s ease; }
          .sidebar.open { transform: translateX(0); }
          .main-content { margin-left: 0; }
          .mobile-toggle { display: inline-flex; }
          .topbar { padding: 12px 16px; height: auto; flex-wrap: wrap; row-gap: 10px; }
          .topbar-actions { flex-wrap: wrap; row-gap: 10px; }
          .search-box { order: 3; flex: 1 1 100%; }
          .search-box input { width: 100%; }
          .page-content { padding: 20px 16px; }
          .stats-row { grid-template-columns: 1fr 1fr; gap: 12px; }
          .admin-footer { padding: 20px 16px; flex-direction: column; }
        }
        @media (max-width: 640px) {
          /* Stacked "card" rows instead of a horizontally-scrolling table */
          .table-wrap { overflow-x: visible; }
          .data-table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
          .data-table, .data-table tbody, .data-table tr, .data-table td { display: block; width: 100%; box-sizing: border-box; }
          .data-table tr { padding: 14px 16px; border-bottom: 1px solid var(--line); }
          .data-table tr:focus-visible { outline: 2px solid var(--gold); outline-offset: -2px; }
          .data-table td { border-bottom: 0; padding: 5px 0; white-space: normal; text-align: left !important; }
          .data-table td[data-label]::before { content: attr(data-label); display: block; font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--ink-faint); margin-bottom: 2px; }
        }
      `}</style>
    </div>
  );
}