<template>
  <div class="breero-ghl min-h-screen bg-white antialiased">
    <!-- HEADER -->
    <header
      class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100"
      :class="{ 'shadow-sm': scrolled }"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-[64px]">
          <div class="flex items-center gap-8">
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              >
                B
              </div>
              <span class="font-bold text-[20px] tracking-tight"
                ><span class="text-blue-600">breero</span>
                <span class="font-normal text-gray-900">PROS</span></span
              >
            </div>
            <nav
              class="hidden lg:flex gap-6 text-[14px] font-medium text-gray-600"
            >
              <a href="#how" class="hover:text-blue-600 transition"
                >How it Works</a
              >
              <a href="#why" class="hover:text-blue-600 transition"
                >Why Breero</a
              >
              <a href="#areas" class="hover:text-blue-600 transition"
                >Service Areas</a
              >
              <a href="#earnings" class="hover:text-blue-600 transition"
                >Earnings</a
              >
              <a href="#faq" class="hover:text-blue-600 transition">FAQ</a>
            </nav>
          </div>
          <div class="flex items-center gap-3">
            <a
              href="#apply"
              class="hidden sm:inline-flex bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition"
              >Apply as Pro</a
            >
            <button
              @click="mobileOpen = !mobileOpen"
              class="lg:hidden p-2.5 rounded-lg border border-gray-200"
            >
              <svg
                v-if="!mobileOpen"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <!-- Mobile menu -->
      <div
        v-if="mobileOpen"
        class="lg:hidden border-t bg-white px-4 py-5 space-y-1 shadow-lg"
      >
        <a
          @click="mobileOpen = false"
          href="#how"
          class="block py-3 px-2 rounded-lg hover:bg-gray-50 font-medium"
          >How it Works</a
        >
        <a
          @click="mobileOpen = false"
          href="#why"
          class="block py-3 px-2 rounded-lg hover:bg-gray-50 font-medium"
          >Why Breero</a
        >
        <a
          @click="mobileOpen = false"
          href="#areas"
          class="block py-3 px-2 rounded-lg hover:bg-gray-50 font-medium"
          >Service Areas</a
        >
        <a
          @click="mobileOpen = false"
          href="#earnings"
          class="block py-3 px-2 rounded-lg hover:bg-gray-50 font-medium"
          >Earnings</a
        >
        <a
          @click="mobileOpen = false"
          href="#faq"
          class="block py-3 px-2 rounded-lg hover:bg-gray-50 font-medium"
          >FAQ</a
        >
        <a
          href="#apply"
          @click="mobileOpen = false"
          class="block bg-blue-600 text-white text-center py-3.5 rounded-full font-semibold mt-3"
          >Apply as Pro - Free</a
        >
        <p class="text-center text-xs text-gray-400 mt-2">
          No card required • 2 min application
        </p>
      </div>
    </header>
    <p v-if="!directIntakeEnabled" class="breero-ghl-preview" role="status">
      PREVIEW ONLY — lead submissions are disabled until the BREERO GoHighLevel
      workflows, site security, and privacy checks are verified.
    </p>

    <section id="apply" class="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div
        class="bg-gray-50 rounded-[24px] p-6 sm:p-8 lg:p-10 border border-gray-100"
      >
        <div class="mb-6">
          <h2 class="text-[28px] sm:text-[32px] font-bold tracking-tight mb-2">
            Apply to Get HVAC Jobs
          </h2>
          <p class="text-sm text-gray-500 font-medium uppercase tracking-wide">
            APPLICATION • 2 MIN • NO CARD NEEDED • {{ timezone }}
          </p>
        </div>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="grid sm:grid-cols-2 gap-4">
            <input
              aria-label="Company name"
              v-model="form.company"
              placeholder="Company Name *"
              class="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              aria-label="Full name"
              v-model="form.name"
              placeholder="Your Name *"
              class="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              aria-label="Phone number"
              v-model="form.phone"
              placeholder="Phone *"
              type="tel"
              class="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[15px]"
              required
            />
            <input
              aria-label="Email address"
              v-model="form.email"
              placeholder="Work Email *"
              type="email"
              class="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[15px]"
              required
            />
            <select
              aria-label="Service city"
              v-model="form.city"
              class="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] bg-white"
              required
            >
              <option value="">City you serve *</option>
              <optgroup label="Florida">
                <option>Miami, FL</option>
                <option>Hialeah, FL</option>
                <option>North Miami, FL</option>
                <option>Fort Lauderdale, FL</option>
                <option>West Palm Beach, FL</option>
                <option>Port St. Lucie, FL</option>
                <option>Orlando, FL</option>
              </optgroup>
              <optgroup label="Texas">
                <option>Houston, TX</option>
                <option>San Antonio, TX</option>
                <option>Laredo, TX</option>
                <option>McAllen, TX</option>
              </optgroup>
              <optgroup label="Massachusetts">
                <option>Boston, MA</option>
                <option>Brockton, MA</option>
              </optgroup>
            </select>
            <select
              aria-label="Number of technicians"
              v-model="form.techs"
              class="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] bg-white sm:col-span-2"
            >
              <option>1-2 Techs</option>
              <option>3-5 Techs</option>
              <option>6+ Techs</option>
              <option>10+ Techs</option>
            </select>
          </div>

          <!-- CALENDAR SCHEDULER -->
          <div class="pt-8 border-t border-gray-200 mt-8">
            <div class="flex items-start justify-between mb-1">
              <h3 class="font-semibold text-[17px]">
                When can we call you back? *
              </h3>
              <span
                class="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium"
                >Required</span
              >
            </div>
            <p class="text-[13px] text-gray-500 mb-5">
              Pick a preferred date and callback time. A team member must
              confirm availability. Timezone:
              <span class="font-medium text-gray-700">{{ timezone }}</span>
            </p>

            <div
              class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-6"
            >
              <button
                v-for="day in days"
                :key="day.dateStr"
                type="button"
                @click="selectDay(day)"
                :class="[
                  'p-3 rounded-2xl border text-[13px] transition-all',
                  selectedDate?.dateStr === day.dateStr
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-[1.02]'
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50',
                ]"
              >
                <div
                  class="font-bold text-[12px] uppercase tracking-wide opacity-80"
                >
                  {{ day.dayName }}
                </div>
                <div class="font-semibold mt-1 text-[14px]">
                  {{ day.monthDay }}
                </div>
                <div class="text-[11px] mt-1 opacity-70">
                  {{ day.isToday ? "Today" : day.isTomorrow ? "Tomorrow" : "" }}
                </div>
              </button>
            </div>

            <div v-if="selectedDate" class="animate-fadeIn">
              <p class="text-sm font-medium mb-3">
                Available times for {{ selectedDate.full }}:
              </p>
              <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
                <button
                  v-for="slot in timeSlots"
                  :key="slot"
                  type="button"
                  @click="selectedTime = slot"
                  :class="[
                    'py-3 rounded-xl border text-[14px] font-medium transition',
                    selectedTime === slot
                      ? 'bg-blue-600 text-white border-blue-600 shadow'
                      : 'bg-white border-gray-200 hover:border-blue-300',
                  ]"
                >
                  {{ slot }}
                </button>
              </div>

              <div
                v-if="selectedDate && selectedTime"
                class="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-[14px] text-blue-900 flex gap-3"
              >
                <span class="text-xl">✅</span>
                <span
                  >Preferred callback:
                  <strong>{{ selectedDate.full }} at {{ selectedTime }}</strong>
                  ({{ timezone }}). This is not a confirmed appointment or SMS
                  promise.</span
                >
              </div>
            </div>
            <p v-else class="text-sm text-gray-400 italic">
              Select a date above to see times
            </p>
          </div>

          <label class="flex items-start gap-3 text-sm text-gray-600"
            ><input
              type="checkbox"
              v-model="contactConsent"
              required
              class="mt-1 shrink-0"
            /><span
              >I agree to be contacted about this professional application. This
              does not opt me into marketing SMS.
              <a href="/en/privacy-policy" class="underline">Privacy policy</a>
              and <a href="/en/terms" class="underline">terms</a>.</span
            ></label
          >
          <input
            v-model="website"
            name="website"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
            class="hidden"
          />
          <p
            v-if="errorMsg"
            role="alert"
            class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
          >
            {{ errorMsg }}
          </p>
          <p
            v-if="successMsg"
            role="status"
            aria-live="polite"
            class="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm"
          >
            {{ successMsg }}
          </p>
          <button
            type="submit"
            :disabled="
              isSubmitting || !selectedDate || !selectedTime || !contactConsent
            "
            class="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-[16px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition shadow-lg shadow-blue-200 mt-8"
          >
            {{
              isSubmitting
                ? "Sending application…"
                : "Submit Application + Request Callback →"
            }}
          </button>
          <p class="text-center text-[12px] text-gray-400">
            Submission is not professional approval or a confirmed callback. No
            payment required.
          </p>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

// Direct browser -> GoHighLevel Inbound Webhook. URLs placed in VITE_ variables
// are PUBLIC in bundled JS; do not use API keys or bearer tokens here.
const webhookUrl = (import.meta.env.VITE_GHL_PRO_WEBHOOK_URL || "").trim();
const directIntakeEnabled =
  import.meta.env.VITE_BREERO_DIRECT_GHL_ENABLED === "true" &&
  document.querySelector('meta[name="lp-ghl-intake-enabled"]')?.getAttribute("content") === "true";
const siteId = import.meta.env.VITE_BREERO_SITE_ID || "breero";
const pixelId = "965185126235275";

const mobileOpen = ref(false);
const scrolled = ref(false);
const form = ref({
  company: "",
  name: "",
  phone: "",
  email: "",
  city: "",
  techs: "1-2 Techs",
});
const selectedDate = ref(null);
const selectedTime = ref(null);
const timezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone);
const isSubmitting = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const contactConsent = ref(false);
const website = ref("");
const retryEventId = ref(null);
const deliveredThisSession = ref(false);

const handleScroll = () => {
  scrolled.value = window.scrollY > 10;
};
onMounted(() => window.addEventListener("scroll", handleScroll));
onUnmounted(() => window.removeEventListener("scroll", handleScroll));

function localDateKey(d) {
  const pad = (v) => String(v).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
const days = computed(() => {
  const arr = [];
  let offset = 0;
  while (arr.length < 14) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + offset++);
    if (d.getDay() === 0) continue;
    const today = new Date(),
      tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    arr.push({
      dateStr: localDateKey(d),
      dayName: d.toLocaleDateString("en", { weekday: "short" }),
      monthDay: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
      full: d.toLocaleDateString("en", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      isToday: d.toDateString() === today.toDateString(),
      isTomorrow: d.toDateString() === tomorrow.toDateString(),
    });
  }
  return arr;
});
const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
];
function selectDay(day) {
  selectedDate.value = day;
  selectedTime.value = null;
  successMsg.value = "";
  retryEventId.value = null;
}
function makeEventId() {
  const id = globalThis.crypto?.randomUUID?.();
  if (!id)
    throw new Error(
      "Secure request identifiers are unavailable. Please use HTTPS.",
    );
  return `pro_${id}`;
}
function permittedPixel() {
  try {
    return (
      localStorage.getItem(`lp-meta-advertising-v1:${siteId}`) === "allow" &&
      navigator.globalPrivacyControl !== true &&
      typeof window.fbq === "function"
    );
  } catch {
    return false;
  }
}
function isConfirmedContact(result, eventId) {
  // GoHighLevel's inbound webhook may return success before creating a contact.
  // Emit Lead only if a synchronous CRM adapter verifies a persisted record.
  if (!result || typeof result !== "object") return false;
  const contactId = result.contactId || result.contact_id || result.contact?.id;
  return (
    typeof contactId === "string" &&
    contactId.length > 0 &&
    result.event_id === eventId &&
    ["saved", "created", "updated"].includes(result.status)
  );
}
function safelyConfiguredUrl() {
  try {
    const u = new URL(webhookUrl);
    return (
      directIntakeEnabled &&
      u.protocol === "https:" &&
      u.hostname === "services.leadconnectorhq.com" &&
      u.pathname.startsWith("/hooks/") &&
      !u.username &&
      !u.password &&
      !u.search &&
      !u.hash
    );
  } catch {
    return false;
  }
}
async function submitForm() {
  if (isSubmitting.value || deliveredThisSession.value) return;
  errorMsg.value = "";
  successMsg.value = "";
  if (!selectedDate.value || !selectedTime.value) {
    errorMsg.value = "Pick a preferred callback date and time.";
    return;
  }
  if (!contactConsent.value) {
    errorMsg.value = "Consent to an application-related callback is required.";
    return;
  }
  if (
    !form.value.company.trim() ||
    !form.value.name.trim() ||
    !form.value.phone.trim() ||
    !form.value.email.trim() ||
    !form.value.city
  ) {
    errorMsg.value = "Complete all required fields.";
    return;
  }
  if (website.value) {
    errorMsg.value = "Your submission could not be verified.";
    return;
  }
  if (!safelyConfiguredUrl()) {
    errorMsg.value =
      "Professional intake is not connected yet. No application was sent.";
    return;
  }
  isSubmitting.value = true;
  try {
    if (!retryEventId.value) retryEventId.value = makeEventId();
    const eventId = retryEventId.value;
    const [city, state] = form.value.city.split(",").map((s) => s.trim());
    const payload = {
      event_id: eventId,
      lead_type: "B2B",
      source: "breero_pro_landing",
      pipeline: "BREERO - Professionals",
      company: form.value.company.trim(),
      name: form.value.name.trim(),
      phone: form.value.phone.trim(),
      email: form.value.email.trim(),
      city,
      state,
      techs: form.value.techs,
      requested_callback_date: selectedDate.value.dateStr,
      requested_callback_time: selectedTime.value,
      timezone: timezone.value,
      requested_callback_preference: `${selectedDate.value.dateStr} ${selectedTime.value}`,
      callback_confirmed: false,
      application_approved: false,
      consent_to_application_contact: true,
      marketing_sms_opt_in: false,
      submitted_at: new Date().toISOString(),
      page_url: location.origin + location.pathname,
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    let response;
    try {
      response = await fetch(webhookUrl, {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
    if (!response.ok)
      throw new Error(
        `CRM rejected the application (HTTP ${response.status}). Please retry.`,
      );
    const result = await response.json().catch(() => null);
    const confirmed = isConfirmedContact(result, eventId);
    successMsg.value = confirmed
      ? "Your professional inquiry was recorded. BREERO will review it and separately confirm any callback."
      : "The CRM endpoint acknowledged your application for processing. A callback and provider approval are not confirmed.";
    if (confirmed && permittedPixel()) {
      window.fbq(
        "trackSingle",
        pixelId,
        "Lead",
        { content_name: "pro_application", lead_type: "B2B" },
        { eventID: eventId },
      );
    }
    deliveredThisSession.value = true;
    retryEventId.value = null;
  } catch (e) {
    errorMsg.value =
      e?.name === "AbortError"
        ? "Request timed out. It may have reached BREERO; contact us before submitting again."
        : e instanceof TypeError
          ? "The CRM endpoint is unreachable from this browser (possibly CORS). No application is confirmed. Contact BREERO before retrying."
          : e?.message || "Unable to submit. No application is confirmed.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.breero-ghl {
  font-family:
    system-ui,
    -apple-system,
    "Segoe UI",
    Arial,
    sans-serif;
  color: #14283f;
  min-height: 100vh;
  background: #f8fafc;
}
.breero-ghl header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem;
}
.breero-ghl section {
  max-width: 850px;
  margin: 0 auto;
  padding: clamp(1rem, 4vw, 3rem);
}
.breero-ghl form {
  background: white;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  padding: clamp(1rem, 4vw, 2rem);
}
.breero-ghl input:not([type="checkbox"]),
.breero-ghl select,
.breero-ghl textarea {
  display: block;
  width: 100%;
  min-height: 44px;
  border: 1px solid #9aaec1;
  border-radius: 9px;
  padding: 0.7rem;
  font: inherit;
}
.breero-ghl textarea {
  min-height: 100px;
}
.breero-ghl input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
}
.breero-ghl form > div,
.breero-ghl form > p {
  margin-block: 0.7rem;
}
.breero-ghl button {
  min-height: 44px;
  cursor: pointer;
  border: 1px solid #94a3b8;
  border-radius: 10px;
  padding: 0.6rem 0.9rem;
  margin: 0.2rem;
  color: #123;
  background: white;
}
.breero-ghl button[disabled] {
  opacity: 0.55;
  cursor: not-allowed;
}
.breero-ghl button[type="submit"] {
  background: #155eef;
  color: white;
  font-weight: 700;
  border-color: #155eef;
  padding: 1rem;
}
.breero-ghl h2 {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  margin-bottom: 0.6rem;
}
.breero-ghl p {
  line-height: 1.5;
}
.breero-ghl a {
  color: #155eef;
}
.breero-ghl :focus-visible {
  outline: 3px solid #155eef;
  outline-offset: 2px;
}
.breero-ghl-preview {
  margin: 1rem auto;
  padding: 0.85rem;
  max-width: 850px;
  border: 1px solid #c99732;
  background: #fff7e6;
  color: #4d3511;
  border-radius: 10px;
}
@media (min-width: 720px) {
  .breero-ghl form > div.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
}
</style>
