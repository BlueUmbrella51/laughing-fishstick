"use strict";

const CONFIG = {
  consentProvider: "Website-demo",
  consentPurpose: "Tracking"
};

let sdkReady = false;
let trackingAllowed = false;

const $ = (id) => document.getElementById(id);

function log(message, details) {
  const entry = document.createElement("div");
  entry.textContent =
    `[${new Date().toLocaleTimeString()}] ${message}`;

  $("eventLog").prepend(entry);
  console.log(message, details ?? "");
}

function getSDK() {
  return typeof window.getSalesforceInteractions === "function"
    ? window.getSalesforceInteractions()
    : window.SalesforceInteractions;
}

function consent(status) {
  return {
    provider: CONFIG.consentProvider,
    purpose: CONFIG.consentPurpose,
    status
  };
}

function sendInteraction(name) {
  console.log(
  "Consents:",
  SalesforceInteractions.getConsents()
);

console.log(
  "Sitemap:",
  SalesforceInteractions.getSitemapResult()
);
  if (!sdkReady || !trackingAllowed) {
    log(`Not sent: ${name} (SDK or consent not ready)`);
    return;
  }

  try {
    const result = getSDK().sendEvent({
      interaction: {
        name: name
      }
    });

    log(`Submitted custom event: ${name}`);

    if (result && typeof result.catch === "function") {
      result.catch(error => {
        log(`Event failed: ${name}`, error);
        console.error(error);
      });
    }
  } catch (error) {
    log(`Event failed: ${name}`, error);
    console.error(error);
  }
}

function buildSitemap() {
  return {
    global: {},
    pageTypes: [
      {
        name: "demo_home",
        isMatch: () => true
      }
    ],
    pageTypeDefault: {
      name: "default"
    }
  };
}

async function initializeSalesforce() {
  const sdk = getSDK();

  if (!sdk) {
    $("sdkStatus").textContent = "SDK not loaded";
    return;
  }

  try {
    $("sdkStatus").textContent = "Initializing...";

    // No consent granted automatically.
    await sdk.init({
      consents: []
    });

    log("Salesforce SDK initialized");

    await sdk.initSitemap(buildSitemap());

    sdkReady = true;
    $("sdkStatus").textContent = "Ready";
    log("Sitemap initialized");

  } catch (error) {
    $("sdkStatus").textContent = "Initialization failed";
    console.error(error);
    log("SDK initialization failed");
  }
}

function updateTracking(allowed) {
  if (!sdkReady) {
    log("SDK not ready");
    return;
  }

  const sdk = getSDK();

  try {
    sdk.updateConsents([
      consent(
        allowed
          ? sdk.ConsentStatus.OptIn
          : sdk.ConsentStatus.OptOut
      )
    ]);

    trackingAllowed = allowed;

    $("consentStatus").textContent =
      allowed ? "Accepted" : "Rejected";

    log(allowed
      ? "Tracking consent granted"
      : "Tracking consent rejected"
    );

    if (allowed) {
      sendInteraction("Website Page View");
    }
  } catch (error) {
    console.error(error);
    log("Consent update failed");
  }
}

$("acceptConsent").addEventListener("click", () => {
  updateTracking(true);
});

$("rejectConsent").addEventListener("click", () => {
  updateTracking(false);
});

$("pageViewButton").addEventListener("click", () => {
  sendInteraction("Website Page View");
});

$("clickButton").addEventListener("click", () => {
  sendInteraction("Demo Button Click");
});

$("cartButton").addEventListener("click", () => {
  sendInteraction("Demo Add To Cart");
});

initializeSalesforce();
