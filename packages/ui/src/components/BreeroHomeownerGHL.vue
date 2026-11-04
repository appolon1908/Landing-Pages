<template>
  <div class="breero-ghl min-h-screen bg-white antialiased">
    <!-- HEADER -->
    <header
      class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            >
              B
            </div>
            <span class="font-bold text-xl tracking-tight"
              ><span class="text-blue-600">breero</span>
              <span class="font-normal">HOME</span></span
            >
          </div>
          <nav class="hidden lg:flex gap-6 text-sm font-medium text-gray-600">
            <a href="#how" class="hover:text-blue-600">How it Works</a>
            <a href="#services" class="hover:text-blue-600">Services</a>
            <a href="#areas" class="hover:text-blue-600">Coverage</a>
            <a href="#faq" class="hover:text-blue-600">FAQ</a>
          </nav>
          <a
            href="#request"
            class="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700"
            >Check Availability</a
          >
        </div>
      </div>
    </header>
    <p v-if="!directIntakeEnabled" class="breero-ghl-preview" role="status">
      PREVIEW ONLY — lead submissions are disabled until the BREERO GoHighLevel
      workflows, site security, and privacy checks are verified.
    </p>

    <!-- FORM WITH CALENDAR -->
    <section id="request" class="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div
        class="bg-white border border-gray-100 rounded-[24px] p-6 sm:p-8 shadow-sm"
      >
        <div class="mb-6">
          <h2 class="text-[28px] font-bold tracking-tight mb-2">
            Request HVAC Service
          </h2>
          <p class="text-sm text-gray-500">
            Service-area screening • Request a preferred window • {{ timezone }}
          </p>
        </div>

        <form @submit.prevent="submitHomeowner" class="space-y-4">
          <select
            aria-label="Requested HVAC service"
            v-model="form.service"
            class="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] bg-white"
            required
          >
            <option value="">What do you need? *</option>
            <option>AC Repair</option>
            <option>Heating Repair</option>
            <option>AC Install</option>
            <option>Heating Install</option>
            <option>Maintenance / Tune-up</option>
            <option>Emergency</option>
          </select>
          <textarea
            aria-label="Describe the HVAC issue"
            v-model="form.issue"
            placeholder="Describe the issue (e.g., AC blowing warm air)"
            class="w-full border border-gray-200 rounded-xl px-4 py-3.5 h-24 text-[15px]"
          ></textarea>

          <input
            aria-label="Full service address"
            v-model="form.address"
            placeholder="Service Address - street, city, state *"
            class="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[15px]"
            required
            @input="checkCoverage"
          />
          <div
            v-if="coverageMsg"
            class="text-[13px] p-3 rounded-xl"
            :class="
              coverageOk
                ? 'bg-green-50 text-green-700 border border-green-100'
                : 'bg-amber-50 text-amber-800 border border-amber-100'
            "
          >
            {{ coverageMsg }}
          </div>

          <!-- CALENDAR: WHEN SHOULD WE COME -->
          <div class="pt-6 border-t border-gray-100 mt-6">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-[17px]">When should we come? *</h3>
              <span
                class="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium"
                >Required</span
              >
            </div>
            <p class="text-[13px] text-gray-500 mb-4">
              Choose a preferred arrival window. This is a request, not an
              appointment. Timezone: {{ timezone }}
            </p>

            <div
              class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-5"
            >
              <button
                v-for="day in days"
                :key="day.dateStr"
                type="button"
                @click="selectDay(day)"
                :class="[
                  'p-3 rounded-2xl border text-sm transition',
                  selectedDate?.dateStr === day.dateStr
                    ? 'bg-blue-600 text-white border-blue-600 shadow'
                    : 'bg-white border-gray-200 hover:border-blue-300',
                ]"
              >
                <div
                  class="font-bold text-[11px] uppercase tracking-wide opacity-70"
                >
                  {{ day.dayName }}
                </div>
                <div class="font-semibold mt-1">{{ day.monthDay }}</div>
                <div class="text-[11px] mt-1 opacity-60">
                  {{ day.isToday ? "Today" : day.isTomorrow ? "Tomorrow" : "" }}
                </div>
              </button>
            </div>

            <div v-if="selectedDate" class="animate-fadeIn">
              <p class="text-[14px] font-medium mb-3">
                Arrival window for {{ selectedDate.full }}:
              </p>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <button
                  v-for="slot in windows"
                  :key="slot"
                  type="button"
                  @click="selectedTime = slot"
                  :class="[
                    'py-3 rounded-xl border text-[14px] font-medium',
                    selectedTime === slot
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-gray-200 hover:bg-gray-50',
                  ]"
                >
                  {{ slot }}
                </button>
              </div>
              <div
                v-if="selectedDate && selectedTime"
                class="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-[14px] text-blue-900"
              >
                Preferred arrival:
                <strong>{{ selectedDate.full }}, {{ selectedTime }}</strong> at
                {{ form.address || "your address" }} ({{ timezone }}). A BREERO
                representative must confirm availability.
              </div>
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100">
            <input
              aria-label="Full name"
              v-model="form.name"
              placeholder="Your Name *"
              class="border border-gray-200 rounded-xl px-4 py-3.5 text-[15px]"
              required
            />
            <input
              aria-label="Phone number"
              v-model="form.phone"
              placeholder="Phone *"
              type="tel"
              class="border border-gray-200 rounded-xl px-4 py-3.5 text-[15px]"
              required
            />
            <input
              aria-label="Email address"
              v-model="form.email"
              placeholder="Email (for confirmation)"
              type="email"
              class="border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] sm:col-span-2"
            />
          </div>

          <label class="flex items-start gap-3 text-sm text-gray-600"
            ><input
              type="checkbox"
              v-model="contactConsent"
              required
              class="mt-1 shrink-0"
            /><span
              >I agree to be contacted about this service request. This does not
              subscribe me to marketing texts.
              <a href="/en/privacy-policy" class="underline">Privacy policy</a
              >.</span
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
            class="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-[16px] disabled:opacity-40 hover:bg-blue-700 shadow-lg shadow-blue-200 mt-6"
          >
            {{ isSubmitting ? "Sending request…" : "Request HVAC Service →" }}
          </button>
          <p class="text-center text-[11px] text-gray-400">
            This is not a confirmed booking. Quotes and arrival times require
            verification. No upfront online payment.
          </p>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// DIRECT browser -> GoHighLevel Inbound Webhook. Build-time VITE_ variables are
// PUBLIC in JavaScript; never place an API key or private bearer token here.
// This sends intake for a workflow; a 2xx response is NOT proof of a saved contact.
const webhookUrl = (
  import.meta.env.VITE_GHL_HOMEOWNER_WEBHOOK_URL || ""
).trim();
const directIntakeEnabled =
  import.meta.env.VITE_BREERO_DIRECT_GHL_ENABLED === "true" &&
  document.querySelector('meta[name="lp-ghl-intake-enabled"]')?.getAttribute("content") === "true";
const siteId = import.meta.env.VITE_BREERO_SITE_ID || "breero";
const pixelId = "965185126235275";

const timezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone);
const form = ref({
  service: "",
  issue: "",
  address: "",
  name: "",
  phone: "",
  email: "",
});
const selectedDate = ref(null);
const selectedTime = ref(null);
const coverageMsg = ref("");
const coverageOk = ref(false);
const contactConsent = ref(false);
const website = ref(""); // honeypot; GHL workflows should also enforce spam checks
const isSubmitting = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const retryEventId = ref(null);
const deliveredThisSession = ref(false);

// Client-side hints only, not authoritative address validation.
const serviceCities = [
  "miami",
  "hialeah",
  "north miami",
  "fort lauderdale",
  "west palm beach",
  "port st lucie",
  "orlando",
  "new york",
  "spring valley",
  "newark",
  "elizabeth",
  "boston",
  "brockton",
  "atlanta",
  "los angeles",
  "long beach",
  "houston",
  "san antonio",
  "laredo",
  "mcallen",
  "minneapolis",
  "saint paul",
  "albuquerque",
  "las cruces",
];
function checkCoverage() {
  const addr = form.value.address.toLowerCase();
  if (!addr) {
    coverageMsg.value = "";
    coverageOk.value = false;
    return;
  }
  const found = serviceCities.some((c) => addr.includes(c));
  coverageOk.value = found;
  coverageMsg.value = found
    ? "This city may be covered. Your full address and availability still require verification."
    : "Please enter your full address. A representative will verify whether it is in our service area.";
}

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
const windows = ["8-10 AM", "10 AM-12 PM", "12-2 PM", "2-4 PM", "4-6 PM"];
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
  return `home_${id}`;
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
  // GoHighLevel inbound webhooks commonly acknowledge receipt BEFORE workflow
  // actions run. Only an explicitly configured synchronous CRM result with a
  // real persisted contact ID and matching event ID qualifies as a Meta Lead.
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
async function submitHomeowner() {
  if (isSubmitting.value || deliveredThisSession.value) return;
  errorMsg.value = "";
  successMsg.value = "";
  if (!selectedDate.value || !selectedTime.value) {
    errorMsg.value = "Select a date and preferred arrival window.";
    return;
  }
  if (!contactConsent.value) {
    errorMsg.value = "Consent to service-related contact is required.";
    return;
  }
  if (
    !form.value.name.trim() ||
    !form.value.phone.trim() ||
    !form.value.address.trim() ||
    !form.value.service
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
      "Online intake is not connected yet. Your request has not been sent.";
    return;
  }
  isSubmitting.value = true;
  try {
    if (!retryEventId.value) retryEventId.value = makeEventId();
    const eventId = retryEventId.value;
    const payload = {
      event_id: eventId,
      lead_type: "B2C",
      source: "breero_homeowner_landing",
      pipeline: "BREERO - Homeowners",
      name: form.value.name.trim(),
      phone: form.value.phone.trim(),
      email: form.value.email.trim(),
      service: form.value.service,
      issue: form.value.issue.trim(),
      address: form.value.address.trim(),
      requested_date: selectedDate.value.dateStr,
      requested_arrival_window: selectedTime.value,
      timezone: timezone.value,
      requested_service_preference: `${selectedDate.value.dateStr} ${selectedTime.value}`,
      service_area_verified: false,
      appointment_confirmed: false,
      consent_to_service_contact: true,
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
        `CRM rejected the request (HTTP ${response.status}). Please retry.`,
      );
    const result = await response.json().catch(() => null);
    const confirmed = isConfirmedContact(result, eventId);
    successMsg.value = confirmed
      ? "Your service inquiry was recorded. BREERO will review your request; no arrival or booking is confirmed."
      : "The CRM endpoint acknowledged your inquiry for processing. A representative must confirm availability and any appointment separately.";
    // Never infer a contact record from a bare 200/202 webhook response.
    if (confirmed && permittedPixel()) {
      window.fbq(
        "trackSingle",
        pixelId,
        "Lead",
        {
          content_name: "homeowner_hvac_request",
          lead_type: "B2C",
          service: form.value.service,
        },
        { eventID: eventId },
      );
    }
    deliveredThisSession.value = true;
    retryEventId.value = null;
  } catch (e) {
    errorMsg.value =
      e?.name === "AbortError"
        ? "Request timed out. It might have been received; contact BREERO before sending it again."
        : e instanceof TypeError
          ? "The CRM endpoint is unreachable from this browser (possibly blocked by CORS). Nothing is confirmed. Contact BREERO before retrying."
          : e?.message || "Unable to send your request. Nothing is confirmed.";
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
