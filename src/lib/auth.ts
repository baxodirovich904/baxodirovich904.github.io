export type Role = "admin" | "dispatcher" | "cashier" | "driver";

export type Session = {
  username: string;
  name: string;
  role: Role;
};

type DemoUser = Session & { password: string };

const demoUsers: DemoUser[] = [
  {
    username: "admin",
    password: "admin123",
    name: "Javohir Narziyev",
    role: "admin",
  },
  {
    username: "dispatcher",
    password: "123456",
    name: "Dilnoza Aytmuratova",
    role: "dispatcher",
  },
  {
    username: "cashier",
    password: "123456",
    name: "Gulnora Sarsenbaeva",
    role: "cashier",
  },
  {
    username: "driver",
    password: "123456",
    name: "Sardor Qulmatov",
    role: "driver",
  },
];

const SESSION_KEY = "bm-session";
const SESSION_EVENT = "bm-session-change";
const roles: Role[] = ["admin", "dispatcher", "cashier", "driver"];

export function authenticate(
  username: string,
  password: string,
  role: Role,
): Session | null {
  const user = demoUsers.find(
    (candidate) =>
      candidate.username === username.trim().toLowerCase() &&
      candidate.password === password &&
      candidate.role === role,
  );

  if (!user) {
    return null;
  }

  return { username: user.username, name: user.name, role: user.role };
}

export function saveSession(session: Session, remember: boolean) {
  const payload = JSON.stringify(session);

  try {
    if (remember) {
      window.localStorage.setItem(SESSION_KEY, payload);
      window.sessionStorage.removeItem(SESSION_KEY);
    } else {
      window.sessionStorage.setItem(SESSION_KEY, payload);
      window.localStorage.removeItem(SESSION_KEY);
    }
    window.dispatchEvent(new Event(SESSION_EVENT));
  } catch {
    // Ignore storage errors.
  }
}

export function parseSession(raw: string | null): Session | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<Session>;

    if (
      typeof parsed.username !== "string" ||
      typeof parsed.name !== "string" ||
      !roles.includes(parsed.role as Role)
    ) {
      return null;
    }

    return {
      username: parsed.username,
      name: parsed.name,
      role: parsed.role as Role,
    };
  } catch {
    return null;
  }
}

export function getSessionSnapshot(): string | null {
  try {
    return (
      window.localStorage.getItem(SESSION_KEY) ??
      window.sessionStorage.getItem(SESSION_KEY)
    );
  } catch {
    return null;
  }
}

export function getServerSessionSnapshot(): string | null {
  return null;
}

export function subscribeSession(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(SESSION_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SESSION_EVENT, callback);
  };
}

export function readSession(): Session | null {
  return parseSession(getSessionSnapshot());
}

export function clearSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event(SESSION_EVENT));
  } catch {
    // Ignore storage errors.
  }
}
