import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import parchment from "@/assets/parchment.jpg";
import type { Dict } from "@/lib/i18n";

function Confetti({ show }: { show: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        angle: (i / 40) * Math.PI * 2,
        dist: 140 + ((i * 37) % 220),
        size: 5 + ((i * 7) % 9),
        color: ["var(--gold)", "var(--gold-deep)", "var(--forest)", "var(--brown)"][i % 4],
      })),
    [],
  );
  if (!show) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist + 120,
            opacity: 0,
            scale: 0.4,
            rotate: 360,
          }}
          transition={{ duration: 1.6 + (i % 5) * 0.15, ease: "easeOut" }}
          className="absolute rounded-[2px]"
          style={{ width: p.size, height: p.size * 1.6, background: p.color }}
        />
      ))}
    </div>
  );
}


function GiftClosed({ opening }: { opening: boolean }) {
  return (
    <svg viewBox="0 0 240 250" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="gb-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6d1d2e" />
          <stop offset="0.45" stopColor="#b0475a" />
          <stop offset="0.75" stopColor="#8f2f42" />
          <stop offset="1" stopColor="#661a29" />
        </linearGradient>
        <linearGradient id="gb-lid" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7d2335" />
          <stop offset="0.45" stopColor="#c25468" />
          <stop offset="0.8" stopColor="#993449" />
          <stop offset="1" stopColor="#701f30" />
        </linearGradient>
        <linearGradient id="gb-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a87623" />
          <stop offset="0.4" stopColor="#f5dc8e" />
          <stop offset="0.65" stopColor="#d9a94a" />
          <stop offset="1" stopColor="#9a6b1f" />
        </linearGradient>
        <radialGradient id="gb-knot" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff2b8" />
          <stop offset="1" stopColor="#b8862f" />
        </radialGradient>
      </defs>

      <ellipse cx="120" cy="232" rx="82" ry="9" fill="#3a2a1a" opacity="0.25" />

      {/* body */}
      <rect x="42" y="114" width="156" height="110" rx="7" fill="url(#gb-body)" />
      <rect x="108" y="114" width="24" height="110" fill="url(#gb-gold)" />
      <rect x="42" y="114" width="156" height="16" fill="#000" opacity="0.16" />

      {/* lid + bow */}
      <motion.g
        animate={opening ? { y: -90, rotate: -10, opacity: 0 } : { y: [0, -4, 0] }}
        transition={
          opening
            ? { duration: 0.6, ease: "easeIn" }
            : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <rect x="30" y="86" width="180" height="34" rx="7" fill="url(#gb-lid)" />
        <rect x="108" y="86" width="24" height="34" fill="url(#gb-gold)" />
        <rect x="34" y="89" width="172" height="3" rx="1.5" fill="#fff" opacity="0.22" />

        {/* bow tails */}
        <path d="M120 84 L98 112 L110 108 L118 118 Z" fill="url(#gb-gold)" />
        <path d="M120 84 L142 112 L130 108 L122 118 Z" fill="url(#gb-gold)" />
        {/* bow loops */}
        <path
          d="M120 84 C 84 26, 42 56, 76 80 C 92 90, 112 88, 120 84 Z"
          fill="url(#gb-gold)"
          stroke="#9a6b1f"
          strokeWidth="1"
        />
        <path
          d="M120 84 C 156 26, 198 56, 164 80 C 148 90, 128 88, 120 84 Z"
          fill="url(#gb-gold)"
          stroke="#9a6b1f"
          strokeWidth="1"
        />
        <circle cx="120" cy="84" r="11" fill="url(#gb-knot)" />
      </motion.g>
    </svg>
  );
}

export function GiftBox({
  t,
  recipient,
  sender,
}: {
  t: Dict;
  recipient: string;
  sender: string;
}) {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [stamped, setStamped] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const openBox = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => setOpened(true), 600);
  };

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2000);
  };

  const copyPromo = async () => {
    setStamped(true);
    window.setTimeout(() => setStamped(false), 600);
    try {
      await navigator.clipboard.writeText(t.gift.promo);
      notify(t.gift.copied);
    } catch {
      notify(t.gift.copied);
    }
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify(t.gift.shareCopied);
    } catch {
      notify(t.gift.shareCopied);
    }
  };

  return (
    <div className="relative flex w-full flex-col items-center">
      <AnimatePresence mode="wait">
        {!opened && (
          <motion.button
            key="box"
            type="button"
            onClick={openBox}
            exit={{ scale: 0.7, opacity: 0, y: 30 }}
            aria-label={t.gift.open}
            className="group relative flex flex-col items-center focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--gold)]/50"
          >
            <span className="block h-56 w-56 transition-transform duration-300 group-hover:scale-105 group-active:scale-95 sm:h-64 sm:w-64">
              <GiftClosed opening={opening} />
            </span>
            <span
              className="mt-2 rounded-full px-6 py-2 text-sm font-semibold tracking-wide text-[var(--ink)] shadow-[var(--shadow-soft)]"
              style={{ background: "var(--gradient-gold)" }}
            >
              {t.gift.open}
            </span>
          </motion.button>
        )}
      </AnimatePresence>


      <Confetti show={opened} />

      <AnimatePresence>
        {opened && (
          <motion.div
            key="cert"
            initial={{ opacity: 0, y: 120, rotateX: 90, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.15 }}
            className="relative w-full max-w-2xl"
            style={{ perspective: 1200 }}
          >
            <div
              className="relative overflow-hidden rounded-lg border-8 p-6 text-center shadow-[var(--shadow-soft)] sm:p-10"
              style={{
                borderColor: "var(--gold)",
                backgroundImage: `url(${parchment})`,
                backgroundSize: "cover",
                color: "var(--ink)",
              }}
            >
              <div className="pointer-events-none absolute inset-2 rounded border border-[var(--gold-deep)]/60" />
              <p className="font-display text-3xl tracking-[0.3em] sm:text-4xl">{t.gift.certTitle}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--brown)]">
                {t.gift.certSubtitle}
              </p>
              <div className="mx-auto my-5 h-px w-32 bg-[var(--gold-deep)]/60" />
              <p className="font-hand text-2xl text-[var(--brown)]">{t.gift.to(recipient)}</p>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed sm:text-base">
                {t.gift.certBody}
              </p>

              <button
                type="button"
                onClick={copyPromo}
                className="group mx-auto mt-6 block"
                aria-label={`${t.gift.promoLabel}: ${t.gift.promo}`}
              >
                <motion.span
                  animate={stamped ? { scale: [1.35, 0.92, 1], rotate: [-8, -4, -4] } : { rotate: -4 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-md border-[3px] border-dashed border-[var(--destructive)] px-5 py-2"
                >
                  <span className="block text-[10px] font-bold tracking-[0.3em] text-[var(--destructive)]">
                    {t.gift.promoLabel}
                  </span>
                  <span className="block font-display text-2xl font-bold text-[var(--destructive)]">
                    {t.gift.promo}
                  </span>
                </motion.span>
              </button>

              <div className="mt-8 flex flex-col items-center gap-2">
                <a
                  href="https://webinvite-six.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WebInvite"
                  className="grid h-20 w-20 place-items-center rounded-full border-4 text-lg font-bold transition-transform hover:scale-105"
                  style={{ borderColor: "var(--gold-deep)", color: "var(--gold-deep)" }}
                >
                  WI
                </a>
                <p className="font-hand text-xl text-[var(--brown)]">{t.gift.from(sender)}</p>
              </div>
            </div>

            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={share}
                className="rounded-full border border-[var(--gold)]/60 bg-card/70 px-6 py-2 text-sm font-medium backdrop-blur transition-colors hover:bg-card"
              >
                {t.gift.share}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[var(--ink)] px-5 py-2 text-sm text-[var(--cream)] shadow-lg"
            role="status"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
