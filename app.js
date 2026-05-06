const STORAGE_KEY = "activityVault.activities";
const ROOM_LAYOUT_KEY = "activityVault.roomLayouts";

// Room objects now store their actual visual width as a percent of the room.
// This keeps resizing consistent across categories/assets instead of scaling from different defaults.
const ROOM_OBJECT_MIN_SIZE = 3.2;
const ROOM_OBJECT_MAX_SIZE = 18;
const ROOM_OBJECT_DEFAULT_SIZE = 8;

const form = document.querySelector("#activityForm");
const activityList = document.querySelector("#activityList");
const emptyState = document.querySelector("#emptyState");
const noMatchState = document.querySelector("#noMatchState");
const archiveSearch = document.querySelector("#archiveSearch");
const archiveSort = document.querySelector("#archiveSort");
const filterButtons = document.querySelectorAll(".filter-button");
const navLinks = document.querySelectorAll(".nav-links a");
const pageSections = document.querySelectorAll(".app-page");
const exportActivityList = document.querySelector("#exportActivityList");
const exportNoActivities = document.querySelector("#exportNoActivities");
const selectAllActivities = document.querySelector("#selectAllActivities");
const clearActivitySelection = document.querySelector("#clearActivitySelection");
const exportPurpose = document.querySelector("#exportPurpose");
const generateDocument = document.querySelector("#generateDocument");
const exportSelectionWarning = document.querySelector("#exportSelectionWarning");
const documentPreview = document.querySelector("#documentPreview");
const copyDocument = document.querySelector("#copyDocument");
const printDocument = document.querySelector("#printDocument");
const downloadDocument = document.querySelector("#downloadDocument");
const documentFileName = document.querySelector("#documentFileName");
const selectedSkillsList = document.querySelector("#selectedSkills");
const skillInput = document.querySelector("#skillInput");
const addSkillButton = document.querySelector("#addSkillButton");
const suggestedSkillsList = document.querySelector("#suggestedSkills");
const skillsHiddenInput = document.querySelector("#skills");
const startDateInput = document.querySelector("#startDate");
const endDateInput = document.querySelector("#endDate");
const weeklyHoursInput = document.querySelector("#weeklyHours");
const estimatedTotalHoursInput = document.querySelector("#estimatedTotalHours");
const estimatedTotalHoursPreview = document.querySelector("#estimatedTotalHoursPreview");
const hoursEstimateMessage = document.querySelector("#hoursEstimateMessage");
const aiAssistantModal = document.querySelector("#aiAssistantModal");
const aiAssistantBackdrop = document.querySelector("#aiAssistantBackdrop");
const closeAiAssistant = document.querySelector("#closeAiAssistant");
const aiAssistantTitle = document.querySelector("#aiAssistantTitle");
const aiPurposeTabs = document.querySelector("#aiPurposeTabs");
const aiOriginalContext = document.querySelector("#aiOriginalContext");
const aiImprovedDraft = document.querySelector("#aiImprovedDraft");
const aiMissingQuestions = document.querySelector("#aiMissingQuestions");
const aiDraftPurposeLabel = document.querySelector("#aiDraftPurposeLabel");
const aiStatusPill = document.querySelector("#aiStatusPill");
const aiErrorMessage = document.querySelector("#aiErrorMessage");
const retryAiDraft = document.querySelector("#retryAiDraft");
const copyAiDraft = document.querySelector("#copyAiDraft");
const replaceDescription = document.querySelector("#replaceDescription");
const replaceImpact = document.querySelector("#replaceImpact");
const saveAiDraft = document.querySelector("#saveAiDraft");
const editRoomButton = document.querySelector("#editRoomButton");
const resetRoomLayout = document.querySelector("#resetRoomLayout");
const roomEditPanel = document.querySelector("#roomEditPanel");
const roomEditTitle = document.querySelector("#roomEditTitle");
const roomAssetSelect = document.querySelector("#roomAssetSelect");
const resetSelectedObject = document.querySelector("#resetSelectedObject");
const roomArchiveList = document.querySelector("#roomArchiveList");
const roomArchiveEmpty = document.querySelector("#roomArchiveEmpty");

const SKILL_SUGGESTIONS = [
  "Communication",
  "Leadership",
  "Teamwork",
  "Project Management",
  "Public Speaking",
  "Problem Solving",
  "Data Analysis",
  "Excel",
  "Python",
  "Web Development",
  "Event Planning",
  "Budgeting",
  "Research",
  "Writing",
  "Customer Service",
  "Teaching",
  "Organization",
  "Creativity",
  "Time Management",
];

const statElements = {
  totalActivities: document.querySelector("#totalActivities"),
  totalHours: document.querySelector("#totalHours"),
  categoriesUsed: document.querySelector("#categoriesUsed"),
  portfolioReadiness: document.querySelector("#portfolioReadiness"),
  portfolioRing: document.querySelector("#portfolioRing"),
  readinessSummary: document.querySelector("#readinessSummary"),
  readinessChecklist: document.querySelector("#readinessChecklist"),
  readinessNextSteps: document.querySelector("#readinessNextSteps"),
  hoursProgress: document.querySelector("#hoursProgress"),
  categoryMiniList: document.querySelector("#categoryMiniList"),
  portfolioBadge: document.querySelector("#portfolioBadge"),
  portfolioBadgeText: document.querySelector("#portfolioBadgeText"),
  recentExperienceList: document.querySelector("#recentExperienceList"),
  vaultRoomObjects: document.querySelector("#vaultRoomObjects"),
  vaultRoomEmpty: document.querySelector("#vaultRoomEmpty"),
};

let activities = loadActivities();
let roomLayouts = loadRoomLayouts();
let activeCategory = "All";
let searchTerm = "";
let sortBy = "newest";
let selectedExportIds = new Set();
let generatedDocumentText = "";
let selectedSkills = [];
let activeAiActivityId = "";
let activeAiPurpose = "resume";
let activeAiDraft = null;
let activeAiRequestId = 0;
let isRoomEditMode = false;
let selectedRoomActivityId = "";
let activeRoomInteraction = null;

const exportFileNames = {
  scholarship: "ActivityVault_Full_Backup.txt",
  resume: "ActivityVault_Resume_Notes.txt",
  transfer: "ActivityVault_Application_List_Backup.txt",
  portfolio: "ActivityVault_Portfolio_Notes.txt",
  report: "ActivityVault_Hours_Proof_Backup.txt",
};

const ACTIVITY_OBJECTS = {
  "Study / Class": {
    label: "Study",
    zone: "bookshelf",
    assets: [
      "assets/book1.png",
      "assets/book2.png",
      "assets/book3.png",
      "assets/book4.png",
      "assets/blue_pencil.png",
      "assets/mint_pencil.png",
      "assets/pink_pencil.png",
      "assets/purple_pencil.png",
      "assets/file.png",
    ],
  },
  "Homework / Assignment": {
    label: "Homework",
    zone: "bookshelf",
    assets: ["assets/file.png", "assets/blue_pencil.png", "assets/mint_pencil.png", "assets/book2.png"],
  },
  "Exam / Test Prep": {
    label: "Exam Prep",
    zone: "bookshelf",
    assets: ["assets/pink_pencil.png", "assets/purple_pencil.png", "assets/book3.png", "assets/file.png"],
  },
  "Reading / Research": {
    label: "Research",
    zone: "bookshelf",
    assets: ["assets/book1.png", "assets/book4.png", "assets/file.png", "assets/mint_pencil.png"],
  },
  "Work / Part-time Job": {
    label: "Work",
    zone: "desk",
    assets: ["assets/coffee.png", "assets/name_tag.png", "assets/shop.png", "assets/desk.png"],
  },
  Internship: {
    label: "Internship",
    zone: "desk",
    assets: ["assets/coffee.png", "assets/name_tag.png", "assets/shop.png", "assets/desk.png"],
  },
  Club: {
    label: "Club",
    zone: "wall",
    assets: ["assets/flag.png", "assets/ribbon.png", "assets/star.png"],
  },
  Leadership: {
    label: "Leadership",
    zone: "wall",
    assets: ["assets/flag.png", "assets/ribbon.png", "assets/star.png"],
  },
  Volunteering: {
    label: "Volunteering",
    zone: "floor",
    assets: [
      "assets/puppy%20(1).png",
      "assets/cat.png",
      "assets/heart.png",
      "assets/forget_flower.png",
      "assets/tulip_flower.png",
      "assets/white_flower.png",
    ],
  },
  Project: {
    label: "Project",
    zone: "desk",
    assets: ["assets/laptop.png", "assets/laptop2.png", "assets/desk.png", "assets/file.png", "assets/star.png"],
  },
  Portfolio: {
    label: "Portfolio",
    zone: "desk",
    assets: ["assets/laptop.png", "assets/laptop2.png", "assets/file.png", "assets/star.png"],
  },
  Competition: {
    label: "Competition",
    zone: "wall",
    assets: ["assets/trophy.png", "assets/medal.png", "assets/ribbon.png", "assets/star.png"],
  },
  Certificate: {
    label: "Certificate",
    zone: "wall",
    assets: ["assets/medal.png", "assets/trophy.png", "assets/ribbon.png", "assets/star.png", "assets/file.png"],
  },
  "Award / Achievement": {
    label: "Award",
    zone: "wall",
    assets: ["assets/trophy.png", "assets/medal.png", "assets/ribbon.png", "assets/star.png"],
  },
  "Personal Learning": {
    label: "Personal Learning",
    zone: "desk",
    assets: ["assets/book4.png", "assets/file.png", "assets/mint_pencil.png", "assets/star.png"],
  },
  Other: {
    label: "Other",
    zone: "desk",
    assets: ["assets/file.png", "assets/mint_pencil.png", "assets/purple_pencil.png", "assets/blue_pencil.png"],
  },
};

const ROOM_OBJECT_POSITIONS = {
  bookshelf: [
    { x: 11, y: 29, size: 9 },
    { x: 18, y: 28, size: 8 },
    { x: 25, y: 30, size: 9 },
    { x: 14, y: 43, size: 8 },
    { x: 22, y: 44, size: 9 },
    { x: 30, y: 43, size: 8 },
  ],
  desk: [
    { x: 54, y: 49, size: 13 },
    { x: 67, y: 52, size: 9 },
    { x: 76, y: 47, size: 10 },
    { x: 60, y: 39, size: 8 },
    { x: 72, y: 37, size: 8 },
    { x: 83, y: 54, size: 8 },
  ],
  wall: [
    { x: 47, y: 20, size: 8 },
    { x: 58, y: 19, size: 8 },
    { x: 69, y: 20, size: 8 },
    { x: 80, y: 19, size: 8 },
    { x: 52, y: 31, size: 7 },
    { x: 74, y: 31, size: 7 },
  ],
  floor: [
    { x: 14, y: 70, size: 13 },
    { x: 28, y: 72, size: 12 },
    { x: 44, y: 75, size: 9 },
    { x: 68, y: 73, size: 11 },
    { x: 82, y: 70, size: 10 },
  ],
};

function updateActiveNav() {
  const hash = window.location.hash || "#dashboard";
  const requestedSection = document.getElementById(hash.replace(/^#/, ""));
  const activeHash = requestedSection ? hash : "#dashboard";
  const isExportPage = activeHash === "#export-center";

  document.body.classList.toggle("export-page-active", isExportPage);
  document.body.classList.toggle("app-dark-route", isExportPage);
  document.body.classList.toggle("app-light-route", !isExportPage);

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === activeHash);
  });

  pageSections.forEach((section) => {
    section.classList.toggle("active-page", `#${section.id}` === activeHash);
  });
}

function createActivityId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadActivities() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveActivities() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
}

function loadRoomLayouts() {
  try {
    return JSON.parse(localStorage.getItem(ROOM_LAYOUT_KEY)) || {};
  } catch {
    return {};
  }
}

function saveRoomLayouts() {
  localStorage.setItem(ROOM_LAYOUT_KEY, JSON.stringify(roomLayouts));
}

function migrateLegacyRoomLayouts() {
  let migratedLayout = false;
  let cleanedActivities = false;

  activities = activities.map((activity) => {
    if (!activity.roomObject) {
      return activity;
    }

    if (!roomLayouts[activity.id]) {
      roomLayouts = {
        ...roomLayouts,
        [activity.id]: {
          ...activity.roomObject,
          id: activity.id,
        },
      };
      migratedLayout = true;
    }

    const { roomObject, ...cleanActivity } = activity;
    cleanedActivities = true;
    return cleanActivity;
  });

  if (migratedLayout) {
    saveRoomLayouts();
  }

  if (cleanedActivities) {
    saveActivities();
  }
}

function parseNumericValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function getTotalHours(activity) {
  return parseNumericValue(activity.estimatedTotalHours ?? activity.totalHours ?? activity.hours);
}

function getWeeklyHours(activity) {
  return parseNumericValue(activity.weeklyHours);
}

function calculateEstimatedHours(startDate, endDate, weeklyHours) {
  const weeklyHoursNumber = Number(weeklyHours);

  if (!startDate || !endDate || weeklyHours === "" || weeklyHours === null || weeklyHours === undefined) {
    return {
      status: "empty",
      message: "Add dates and weekly hours to calculate.",
      value: 0,
    };
  }

  if (!Number.isFinite(weeklyHoursNumber) || weeklyHoursNumber <= 0) {
    return {
      status: "invalid",
      message: "Weekly hours must be greater than 0.",
      value: 0,
    };
  }

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (end < start) {
    return {
      status: "invalid",
      message: "End date must be after start date.",
      value: 0,
    };
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const inclusiveDays = Math.floor((end - start) / millisecondsPerDay) + 1;
  const weeks = Math.max(1, inclusiveDays / 7);
  const estimate = Math.round(weeks * weeklyHoursNumber);

  return {
    status: "valid",
    message: `${inclusiveDays.toLocaleString()} day${inclusiveDays === 1 ? "" : "s"} included in the estimate.`,
    value: estimate,
  };
}

function getCurrentHoursEstimate() {
  return calculateEstimatedHours(startDateInput.value, endDateInput.value, weeklyHoursInput.value);
}

function updateHoursEstimatePreview() {
  const estimate = getCurrentHoursEstimate();
  estimatedTotalHoursInput.value = estimate.status === "valid" ? String(estimate.value) : "";
  estimatedTotalHoursPreview.textContent =
    estimate.status === "valid" ? `${estimate.value.toLocaleString()} estimated total hours` : estimate.message;
  hoursEstimateMessage.textContent =
    estimate.status === "valid" ? estimate.message : "Calculated from the activity period and weekly hours.";
  hoursEstimateMessage.classList.toggle("validation-message", estimate.status === "invalid");
  estimatedTotalHoursPreview.classList.toggle("is-warning", estimate.status === "invalid");
  return estimate;
}

function getFormActivity() {
  const formData = new FormData(form);
  const hoursEstimate = getCurrentHoursEstimate();
  const weeklyHours = Number(formData.get("weeklyHours")) || 0;
  const estimatedTotalHours = hoursEstimate.status === "valid" ? hoursEstimate.value : 0;

  return {
    id: createActivityId(),
    title: formData.get("title").trim(),
    organization: formData.get("organization").trim(),
    category: formData.get("category"),
    role: formData.get("role").trim(),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    weeklyHours,
    estimatedTotalHours,
    hours: estimatedTotalHours,
    description: formData.get("description").trim(),
    skills: [...selectedSkills],
    impact: formData.get("impact").trim(),
    evidence: {
      title: formData.get("evidenceTitle").trim(),
      type: formData.get("evidenceType"),
      url: formData.get("evidenceUrl").trim(),
      notes: formData.get("evidenceNotes").trim(),
    },
    createdAt: new Date().toISOString(),
  };
}

function getActivityTime(activity) {
  return new Date(activity.createdAt || activity.startDate || 0).getTime();
}

function formatDateRange(activity) {
  if (activity.startDate && activity.endDate) {
    return `${activity.startDate} to ${activity.endDate}`;
  }

  return activity.startDate || activity.endDate || "Dates not added";
}

function formatHours(activity) {
  const totalHours = getTotalHours(activity);
  const weeklyHours = getWeeklyHours(activity);

  if (weeklyHours > 0 && totalHours > 0) {
    return `${totalHours.toLocaleString()} estimated total hours (${weeklyHours.toLocaleString()} hrs/week)`;
  }

  if (weeklyHours > 0) {
    return `${weeklyHours.toLocaleString()} hrs/week`;
  }

  return totalHours > 0 ? `${totalHours.toLocaleString()} estimated total hours` : "No hours added";
}

function formatWeeklyHours(activity) {
  const weeklyHours = getWeeklyHours(activity);
  return weeklyHours > 0 ? `${weeklyHours.toLocaleString()} hrs/week` : "Not specified";
}

function formatEstimatedTotalHours(activity) {
  const totalHours = getTotalHours(activity);
  return totalHours > 0 ? `${totalHours.toLocaleString()} hrs` : "Not specified";
}

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value || "";
  return div.innerHTML;
}

function normalizeText(value) {
  return String(value || "").toLowerCase();
}

function getSkillArray(skills) {
  const rawSkills = Array.isArray(skills) ? skills : String(skills || "").split(",");
  const normalizedSkills = [];

  rawSkills.forEach((skill) => {
    const trimmedSkill = String(skill).trim();
    const alreadyAdded = normalizedSkills.some(
      (existingSkill) => existingSkill.toLowerCase() === trimmedSkill.toLowerCase()
    );

    if (trimmedSkill && !alreadyAdded) {
      normalizedSkills.push(trimmedSkill);
    }
  });

  return normalizedSkills;
}

function formatSkills(skills, fallback = "Not specified") {
  const skillList = getSkillArray(skills);
  return skillList.length ? skillList.join(", ") : fallback;
}

function hasSkillValue(skills) {
  return getSkillArray(skills).length > 0;
}

function getEvidence(activity) {
  const evidence = activity.evidence || {};

  return {
    title: String(evidence.title || "").trim(),
    type: String(evidence.type || "").trim(),
    url: String(evidence.url || "").trim(),
    notes: String(evidence.notes || "").trim(),
  };
}

function hasEvidence(activity) {
  const evidence = getEvidence(activity);
  return Boolean(evidence.title || evidence.type || evidence.url || evidence.notes);
}

function isLinkValue(value) {
  return /^https?:\/\//i.test(value) || /^www\./i.test(value);
}

function getLinkHref(value) {
  if (/^www\./i.test(value)) {
    return `https://${value}`;
  }

  return value;
}

function getEvidenceLine(activity) {
  const evidence = getEvidence(activity);

  if (!hasEvidence(activity)) {
    return "";
  }

  return `Evidence: ${evidence.title || "Proof material"} — ${evidence.type || "Type not specified"} — ${evidence.url || "No link or file name added"}`;
}

function sentenceCase(value) {
  const text = value.trim();

  if (!text) {
    return "";
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function trimEndingPunctuation(value) {
  return value.trim().replace(/[.!?]+$/, "");
}

function lowerFirst(value) {
  const text = String(value || "").trim();

  if (!text) {
    return "";
  }

  return text.charAt(0).toLowerCase() + text.slice(1);
}

function getOutputText(activity) {
  const role = activity.role || "participant";
  const organization = activity.organization || activity.title || "this activity";
  const action = trimEndingPunctuation(activity.description || `contributed to ${activity.title || "the activity"}`);
  const skills = formatSkills(activity.skills, "communication and organization");
  const impact = trimEndingPunctuation(activity.impact || "a meaningful outcome");
  const hours = getTotalHours(activity);
  const hourText = hours > 0 ? ` across ${hours.toLocaleString()} hour${hours === 1 ? "" : "s"}` : "";

  return {
    resume: `${sentenceCase(action)} using ${skills}, contributing to this result: ${impact}${hourText}.`,
    reflection: `As a ${role} in ${organization}, I learned how everyday commitment can create impact through this work: ${action}, creating this result: ${impact}.`,
    portfolio: `${activity.title || "This activity"} highlights my experience as a ${role} with ${organization}, where I used ${skills}. My work included: ${action}, supporting this result: ${impact}.`,
  };
}

function getActivityById(activityId) {
  return activities.find((activity) => activity.id === activityId);
}

function getCategoryIcon(category) {
  const icons = {
    "Study / Class": "B",
    "Homework / Assignment": "H",
    "Exam / Test Prep": "E",
    "Reading / Research": "R",
    Academic: "B",
    "Work / Part-time Job": "C",
    "Work / Internship": "C",
    Work: "C",
    Internship: "I",
    Club: "F",
    Leadership: "L",
    Volunteering: "♡",
    Project: "L",
    Portfolio: "P",
    "Personal Learning": "P",
    Certificate: "✓",
    "Award / Achievement": "★",
    Competition: "★",
    Other: "✦",
  };

  return icons[category] || "✦";
}

function getCategoryGroup(category) {
  const groups = {
    Academic: "Study / Class",
    Work: "Work / Part-time Job",
    "Work / Internship": "Internship",
    Award: "Award / Achievement",
  };

  return groups[category] || category || "Other";
}

function getActivityObjectConfig(category) {
  const categoryGroup = getCategoryGroup(category);
  return ACTIVITY_OBJECTS[categoryGroup] || ACTIVITY_OBJECTS.Other;
}

function getCategoryObject(category) {
  return getActivityObjectConfig(category).label;
}

function getCategoryAsset(category, index = 0) {
  const assets = getActivityObjectConfig(category).assets;
  return assets[index % assets.length];
}

function renderCategoryVisual(category, index = 0) {
  const asset = getCategoryAsset(category, index);
  const label = `${getCategoryObject(category)} icon`;

  return `<img src="${escapeHTML(asset)}" alt="${escapeHTML(label)}" loading="lazy" />`;
}

function getRoomObjectPosition(zone, index) {
  const positions = ROOM_OBJECT_POSITIONS[zone] || ROOM_OBJECT_POSITIONS.desk;
  return positions[index % positions.length];
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

function getDefaultRoomLayout(activity, zoneIndex = 0) {
  const config = getActivityObjectConfig(activity.category);
  const position = getRoomObjectPosition(config.zone, zoneIndex);

  return {
    id: activity.id,
    x: position.x,
    y: position.y,
    size: position.size || ROOM_OBJECT_DEFAULT_SIZE,
    scale: 1,
    rotation: 0,
    asset: getCategoryAsset(activity.category, zoneIndex),
    hidden: false,
  };
}

function getRoomLayout(activity, zoneIndex = 0) {
  const defaultLayout = getDefaultRoomLayout(activity, zoneIndex);
  const customLayout = roomLayouts[activity.id] || activity.roomObject || {};
  const safeAssetChoices = getActivityObjectConfig(activity.category).assets;
  const asset = safeAssetChoices.includes(customLayout.asset) ? customLayout.asset : defaultLayout.asset;
  const legacySizeFromScale = Number.isFinite(Number(customLayout.scale))
    ? defaultLayout.size * Number(customLayout.scale)
    : defaultLayout.size;

  return {
    id: activity.id,
    x: clampNumber(customLayout.x ?? defaultLayout.x, 3, 97),
    y: clampNumber(customLayout.y ?? defaultLayout.y, 4, 96),
    // Store size directly as room-width percent. This fixes inconsistent min/max resize behavior
    // caused by different zone defaults being multiplied by scale.
    size: clampNumber(customLayout.size ?? legacySizeFromScale, ROOM_OBJECT_MIN_SIZE, ROOM_OBJECT_MAX_SIZE),
    scale: 1,
    rotation: clampNumber(customLayout.rotation ?? defaultLayout.rotation, -180, 180),
    asset,
    hidden: Boolean(customLayout.hidden || customLayout.hiddenInRoom || customLayout.roomDeleted),
  };
}

function updateRoomObject(activityId, updates) {
  roomLayouts = {
    ...roomLayouts,
    [activityId]: {
      ...(roomLayouts[activityId] || {}),
      id: activityId,
      ...updates,
    },
  };
  saveRoomLayouts();
  renderVaultRoom();
}

function resetRoomObject(activityId) {
  const { [activityId]: removedLayout, ...remainingLayouts } = roomLayouts;
  roomLayouts = remainingLayouts;
  saveRoomLayouts();
  renderVaultRoom();
}

function resetAllRoomObjects() {
  roomLayouts = {};
  selectedRoomActivityId = "";
  saveRoomLayouts();
  renderVaultRoom();
}

function setRoomObjectInMemory(activityId, updates) {
  roomLayouts = {
    ...roomLayouts,
    [activityId]: {
      ...(roomLayouts[activityId] || {}),
      id: activityId,
      ...updates,
    },
  };
}

function applyRoomObjectStyle(activityId) {
  const activity = getActivityById(activityId);
  const objectButton = statElements.vaultRoomObjects?.querySelector(`[data-id="${CSS.escape(activityId)}"]`);

  if (!activity || !objectButton) {
    return;
  }

  const config = getActivityObjectConfig(activity.category);
  const zoneIndex = getZoneIndexForActivity(activity);
  const layout = getRoomLayout(activity, zoneIndex);
  objectButton.style.setProperty("--x", `${layout.x}%`);
  objectButton.style.setProperty("--y", `${layout.y}%`);
  objectButton.style.setProperty("--size", `${layout.size}%`);
  objectButton.style.setProperty("--rotation", `${layout.rotation}deg`);
}

function getObjectCenterPercent(sceneRect, objectRect) {
  return {
    x: clampNumber(((objectRect.left + objectRect.width / 2 - sceneRect.left) / sceneRect.width) * 100, 4, 96),
    y: clampNumber(((objectRect.top + objectRect.height / 2 - sceneRect.top) / sceneRect.height) * 100, 5, 94),
  };
}

function getPointerAngle(centerX, centerY, pointerX, pointerY) {
  return (Math.atan2(pointerY - centerY, pointerX - centerX) * 180) / Math.PI;
}

function getPurposeLabel(purpose) {
  const labels = {
    resume: "Resume",
    scholarship: "Scholarship",
    transfer: "Transfer",
    portfolio: "Portfolio",
  };

  return labels[purpose] || "Resume";
}

function getPurposeAngle(purpose) {
  const angles = {
    resume: "resume or internship applications",
    scholarship: "scholarship essays and short answers",
    transfer: "transfer application activity sections",
    portfolio: "a personal portfolio showcase",
  };

  return angles[purpose] || angles.resume;
}

function getActivityAction(activity) {
  return trimEndingPunctuation(activity.description || `contributed to ${activity.title || "this activity"}`);
}

function getStrongerImpact(activity, purpose) {
  const impact = trimEndingPunctuation(activity.impact || "supported a meaningful outcome");
  const beneficiary = activity.organization || "the organization";
  const totalHours = getTotalHours(activity);
  const hourText = totalHours > 0 ? ` through an estimated ${totalHours.toLocaleString()} total hours` : "";
  const purposeTail = {
    resume: "showing responsibility, follow-through, and practical contribution.",
    scholarship: "demonstrating commitment, initiative, and service-minded growth.",
    transfer: "highlighting readiness to contribute to a new academic community.",
    portfolio: "showing growth, applied skills, and a clear record of contribution.",
  };

  return `${sentenceCase(impact)} for ${beneficiary}${hourText}, ${purposeTail[purpose] || purposeTail.resume}`;
}

function getMissingDetailQuestions(activity) {
  const questions = [];
  const description = String(activity.description || "").trim();
  const impact = String(activity.impact || "").trim();

  if (description.length < 70) {
    questions.push("Can you add more specific actions you took, tools you used, or responsibilities you handled?");
  }

  if (impact.length < 70) {
    questions.push("Can you add a measurable result, such as number of people, hours, money, or event size?");
    questions.push("What changed because of your work?");
  }

  if (!activity.organization) {
    questions.push("Which organization, club, class, or community group was connected to this activity?");
  }

  if (!hasSkillValue(activity.skills)) {
    questions.push("Which skills did you practice or demonstrate through this activity?");
  }

  if (getTotalHours(activity) <= 0) {
    questions.push("Can you add weekly hours and dates so ActivityVault can estimate the total time commitment?");
  }

  if (!hasEvidence(activity)) {
    questions.push("What evidence can support this activity, such as a link, certificate, photo, email, or document?");
  }

  questions.push("Who benefited from this activity?");

  return [...new Set(questions)].slice(0, 4);
}

function buildAIWritingDraft(activity, purpose) {
  const title = activity.title || "this activity";
  const role = activity.role || "participant";
  const organization = activity.organization || "the organization";
  const action = getActivityAction(activity);
  const actionPhrase = lowerFirst(action);
  const impact = trimEndingPunctuation(activity.impact || "supported a meaningful outcome");
  const skills = formatSkills(activity.skills, "communication, organization, and problem solving");
  const weeklyHours = formatWeeklyHours(activity);
  const totalHours = formatEstimatedTotalHours(activity);
  const purposeAngle = getPurposeAngle(purpose);
  const polishedDescription = `As a ${role} with ${organization}, I ${actionPhrase} while applying ${skills}. This experience strengthened my ability to contribute to ${purposeAngle} with clear responsibility and follow-through.`;
  const strongerImpact = getStrongerImpact(activity, purpose);
  const bullets = [
    `${sentenceCase(action)} using ${skills}, supporting this result: ${impact}.`,
    `Dedicated ${weeklyHours} with ${totalHours} estimated total, building experience in ${activity.category || "student involvement"} and documenting growth through ActivityVault.`,
  ];
  const reflection = `Through ${title}, I learned how consistent effort, reflection, and evidence-backed experience can turn everyday involvement into a stronger student story.`;
  const questions = getMissingDetailQuestions(activity);
  const text = [
    "Polished Description:",
    polishedDescription,
    "",
    "Stronger Impact Statement:",
    strongerImpact,
    "",
    "Resume-Style Bullets:",
    `- ${bullets[0]}`,
    `- ${bullets[1]}`,
    "",
    "Reflection Sentence:",
    reflection,
    "",
    "Suggested Missing Details:",
    ...questions.map((question) => `- ${question}`),
  ].join("\n");

  return {
    polishedDescription,
    strongerImpact,
    bullets,
    reflection,
    questions,
    suggestedSkills: [],
    confidenceNote: "Template fallback. Add more specific details for stronger writing.",
    source: "template",
    text,
  };
}

function buildActivityImprovementPayload(activity, purpose) {
  const evidence = getEvidence(activity);

  return {
    title: activity.title || "",
    organization: activity.organization || "",
    category: activity.category || "",
    role: activity.role || "",
    dates: {
      startDate: activity.startDate || "",
      endDate: activity.endDate || "",
      display: formatDateRange(activity),
    },
    weeklyHours: getWeeklyHours(activity),
    estimatedTotalHours: getTotalHours(activity),
    description: activity.description || "",
    skills: getSkillArray(activity.skills),
    impact: activity.impact || "",
    evidence,
    purpose,
  };
}

function formatAiDraftText(draft) {
  return [
    "Polished Description:",
    draft.polishedDescription,
    "",
    "Stronger Impact Statement:",
    draft.strongerImpact,
    "",
    "Resume-Style Bullets:",
    ...draft.bullets.map((bullet) => `- ${bullet}`),
    "",
    "Reflection Sentence:",
    draft.reflection,
    "",
    "Suggested Missing Details:",
    ...draft.questions.map((question) => `- ${question}`),
    "",
    "Suggested Skills:",
    draft.suggestedSkills.length ? draft.suggestedSkills.join(", ") : "No additional skills suggested.",
    "",
    "Confidence Note:",
    draft.confidenceNote,
  ].join("\n");
}

function normalizeAiDraftResponse(result, fallbackDraft) {
  const normalizedDraft = {
    polishedDescription: String(result.polishedDescription || fallbackDraft.polishedDescription || "").trim(),
    strongerImpact: String(result.strongerImpact || fallbackDraft.strongerImpact || "").trim(),
    bullets: Array.isArray(result.resumeBullets)
      ? result.resumeBullets.map((bullet) => String(bullet).trim()).filter(Boolean).slice(0, 2)
      : fallbackDraft.bullets,
    reflection: String(result.reflectionSentence || fallbackDraft.reflection || "").trim(),
    questions: Array.isArray(result.missingDetailQuestions)
      ? result.missingDetailQuestions.map((question) => String(question).trim()).filter(Boolean).slice(0, 4)
      : fallbackDraft.questions,
    suggestedSkills: Array.isArray(result.suggestedSkills)
      ? result.suggestedSkills.map((skill) => String(skill).trim()).filter(Boolean).slice(0, 8)
      : [],
    confidenceNote: String(result.confidenceNote || "Generated from the saved activity details.").trim(),
    source: "api",
  };

  normalizedDraft.text = formatAiDraftText(normalizedDraft);
  return normalizedDraft;
}

function requestAiImprovement(activity, purpose, fallbackDraft, requestId) {
  // Template-only mode: ActivityVault no longer requires an OpenAI API key or backend API route.
  // Keep this function as a resolved promise so the existing helper flow remains stable.
  return Promise.resolve(null);
}

function renderAiOriginalContext(activity) {
  const evidence = getEvidence(activity);

  aiOriginalContext.innerHTML = `
    <div class="ai-context-grid">
      <div>
        <span class="detail-label">Original Description</span>
        <p>${escapeHTML(activity.description) || "Not added"}</p>
      </div>
      <div>
        <span class="detail-label">Original Impact / Result</span>
        <p>${escapeHTML(activity.impact) || "Not added"}</p>
      </div>
      <div>
        <span class="detail-label">Selected Skills</span>
        <div class="archive-skill-list">${renderSkillChips(activity.skills)}</div>
      </div>
      <div>
        <span class="detail-label">Hours</span>
        <p>${escapeHTML(formatWeeklyHours(activity))} · ${escapeHTML(formatEstimatedTotalHours(activity))}</p>
      </div>
      <div>
        <span class="detail-label">Evidence / Proof</span>
        <p>${
          hasEvidence(activity)
            ? `${escapeHTML(evidence.title || "Proof material")} · ${escapeHTML(evidence.type || "Type not specified")} · ${escapeHTML(evidence.url || "No link or file name added")}`
            : "No evidence added yet"
        }</p>
      </div>
    </div>
  `;
}

function renderAiDraftContent(activity, draft) {
  aiAssistantTitle.textContent = `AI Writing Assistant: ${activity.title || "Untitled Activity"}`;
  aiDraftPurposeLabel.textContent = getPurposeLabel(activeAiPurpose);
  aiStatusPill.textContent = draft.source === "api" ? "Saved draft" : "Template draft";
  aiStatusPill.classList.toggle("is-api", draft.source === "api");
  aiImprovedDraft.innerHTML = `
    <div class="ai-draft-section">
      <span class="detail-label">Polished Description</span>
      <p>${escapeHTML(draft.polishedDescription)}</p>
    </div>
    <div class="ai-draft-section">
      <span class="detail-label">Stronger Impact Statement</span>
      <p>${escapeHTML(draft.strongerImpact)}</p>
    </div>
    <div class="ai-draft-section">
      <span class="detail-label">Resume-Style Bullets</span>
      <ul>${draft.bullets.map((bullet) => `<li>${escapeHTML(bullet)}</li>`).join("")}</ul>
    </div>
    <div class="ai-draft-section">
      <span class="detail-label">Reflection Sentence</span>
      <p>${escapeHTML(draft.reflection)}</p>
    </div>
    <div class="ai-draft-section">
      <span class="detail-label">Suggested Skills</span>
      <div class="archive-skill-list">
        ${
          draft.suggestedSkills.length
            ? draft.suggestedSkills.map((skill) => `<span class="archive-skill-chip">${escapeHTML(skill)}</span>`).join("")
            : `<span class="skills-empty">No additional skills suggested.</span>`
        }
      </div>
    </div>
    <div class="ai-draft-section">
      <span class="detail-label">Confidence Note</span>
      <p>${escapeHTML(draft.confidenceNote)}</p>
    </div>
  `;

  aiMissingQuestions.innerHTML = draft.questions
    .map((question) => `<li>${escapeHTML(question)}</li>`)
    .join("");
}

function renderAiDraftLoading() {
  aiStatusPill.textContent = "Template draft";
  aiStatusPill.classList.remove("is-api");
  aiImprovedDraft.insertAdjacentHTML(
    "afterbegin",
    `<div class="ai-loading-state" id="aiLoadingState">Using a template-based draft from your saved activity details.</div>`
  );
}

function renderAiError(error) {
  document.querySelector("#aiLoadingState")?.remove();
  aiErrorMessage.hidden = false;
  aiErrorMessage.textContent = `Template helper could not refresh. ${error.message}`;
  retryAiDraft.hidden = false;
  aiStatusPill.textContent = "Template fallback";
  aiStatusPill.classList.remove("is-api");
}

function setAiBusyState(isBusy) {
  [copyAiDraft, replaceDescription, replaceImpact, saveAiDraft, retryAiDraft].forEach((button) => {
    button.disabled = isBusy && button !== retryAiDraft;
  });
}

async function renderAiDraft(activity) {
  const requestId = activeAiRequestId + 1;
  activeAiRequestId = requestId;
  activeAiDraft = buildAIWritingDraft(activity, activeAiPurpose);
  aiAssistantTitle.textContent = `AI Writing Assistant: ${activity.title || "Untitled Activity"}`;
  aiDraftPurposeLabel.textContent = getPurposeLabel(activeAiPurpose);
  aiErrorMessage.hidden = true;
  aiErrorMessage.textContent = "";
  retryAiDraft.hidden = true;
  setAiBusyState(true);

  aiPurposeTabs.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.purpose === activeAiPurpose);
  });

  renderAiDraftContent(activity, activeAiDraft);
  renderAiDraftLoading();

  try {
    const apiDraft = await requestAiImprovement(activity, activeAiPurpose, activeAiDraft, requestId);

    if (!apiDraft) {
      return;
    }

    activeAiDraft = apiDraft;
    renderAiDraftContent(activity, activeAiDraft);
  } catch (error) {
    if (requestId === activeAiRequestId) {
      renderAiError(error);
    }
  } finally {
    if (requestId === activeAiRequestId) {
      setAiBusyState(false);
    }
  }
}

function renderAiAssistant() {
  const activity = getActivityById(activeAiActivityId);

  if (!activity) {
    return;
  }

  renderAiOriginalContext(activity);
  renderAiDraft(activity);
}

function openAiAssistant(activityId) {
  activeAiActivityId = activityId;
  activeAiPurpose = "resume";
  renderAiAssistant();
  aiAssistantModal.hidden = false;
  document.body.classList.add("modal-open");
  closeAiAssistant.focus();
}

function closeAiAssistantPanel() {
  activeAiRequestId += 1;
  aiAssistantModal.hidden = true;
  document.body.classList.remove("modal-open");
  activeAiActivityId = "";
  activeAiDraft = null;
}

function updateAiActivity(updater) {
  const activity = getActivityById(activeAiActivityId);

  if (!activity || !activeAiDraft) {
    return;
  }

  updater(activity);
  saveActivities();
  renderActivities();
  renderAiAssistant();
}

function renderSavedWriting(activity) {
  const savedWriting = Array.isArray(activity.savedWriting) ? activity.savedWriting : [];

  if (savedWriting.length === 0) {
    return "";
  }

  return `
    <section class="saved-writing-block">
      <span class="detail-label">Saved Writing</span>
      <div class="saved-writing-list">
        ${savedWriting
          .map(
            (item, index) => `
              <article class="saved-writing-item">
                <div class="output-item-header">
                  <h4>${escapeHTML(item.label || "Saved Draft")}</h4>
                  <button class="copy-button" type="button" data-copy-saved-writing="${index}">Copy</button>
                </div>
                <p class="output-text">${escapeHTML(item.text)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderOutputBuilder(activity) {
  const outputs = getOutputText(activity);
  const outputItems = [
    ["Resume Bullet", outputs.resume],
    ["Scholarship Reflection", outputs.reflection],
    ["Portfolio Summary", outputs.portfolio],
  ];

  return `
    <section class="output-builder" aria-label="Writing drafts for ${escapeHTML(activity.title)}">
      <div class="output-heading">
        <span class="detail-label">Writing Drafts</span>
        <span>Optional helper</span>
      </div>

      <div class="output-list">
        ${outputItems
          .map(
            ([label, text]) => `
              <article class="output-item" data-draft-label="${escapeHTML(label)}">
                <div class="output-item-header">
                  <h4>${label}</h4>
                  <div class="draft-actions">
                    <button class="copy-button" type="button">Copy</button>
                    <button class="secondary-action add-draft-button" type="button" data-draft-label="${escapeHTML(label)}">Add to Activity</button>
                  </div>
                </div>
                <p class="output-text">${escapeHTML(text)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function addWritingDraftToActivity(activityId, label, text) {
  activities = activities.map((activity) => {
    if (activity.id !== activityId) {
      return activity;
    }

    const savedWriting = Array.isArray(activity.savedWriting) ? activity.savedWriting : [];

    return {
      ...activity,
      savedWriting: [
        ...savedWriting,
        {
          label,
          text,
          savedAt: new Date().toISOString(),
        },
      ],
    };
  });

  saveActivities();
  renderActivities();
}


async function copyText(text, button) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.append(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
  button.focus();
}

function renderSuggestedSkills() {
  suggestedSkillsList.innerHTML = SKILL_SUGGESTIONS.map((skill) => {
    const isSelected = selectedSkills.some((selectedSkill) => selectedSkill.toLowerCase() === skill.toLowerCase());

    return `
      <button class="suggestion-chip ${isSelected ? "is-selected" : ""}" type="button" data-skill="${escapeHTML(skill)}">
        ${escapeHTML(skill)}
      </button>
    `;
  }).join("");
}

function renderSelectedSkills() {
  selectedSkillsList.innerHTML = selectedSkills.length
    ? selectedSkills
        .map(
          (skill) => `
            <span class="skill-chip">
              ${escapeHTML(skill)}
              <button type="button" data-skill="${escapeHTML(skill)}" aria-label="Remove ${escapeHTML(skill)}">×</button>
            </span>
          `
        )
        .join("")
    : `<span class="skills-empty">No skills selected yet.</span>`;

  skillsHiddenInput.value = selectedSkills.join(", ");
  renderSuggestedSkills();
}

function addSelectedSkill(skill) {
  const trimmedSkill = String(skill || "").trim();
  const alreadySelected = selectedSkills.some(
    (selectedSkill) => selectedSkill.toLowerCase() === trimmedSkill.toLowerCase()
  );

  if (!trimmedSkill || alreadySelected) {
    return;
  }

  selectedSkills = [...selectedSkills, trimmedSkill];
  renderSelectedSkills();
}

function removeSelectedSkill(skill) {
  selectedSkills = selectedSkills.filter((selectedSkill) => selectedSkill.toLowerCase() !== skill.toLowerCase());
  renderSelectedSkills();
}

function addSkillFromInput() {
  addSelectedSkill(skillInput.value);
  skillInput.value = "";
  skillInput.focus();
}

function getReadinessItems(totalHours) {
  const hasCategory = (category) => activities.some((activity) => getCategoryGroup(activity.category) === category);
  const hasAnyCategory = (categories) =>
    activities.some((activity) => categories.includes(getCategoryGroup(activity.category)));
  const withHours = activities.filter((activity) => getTotalHours(activity) > 0).length;
  const withSkills = activities.filter((activity) => hasSkillValue(activity.skills)).length;
  const withImpact = activities.filter((activity) => (activity.impact || "").trim().length > 0).length;
  const hasStrongImpact = activities.some((activity) => (activity.impact || "").trim().length >= 70);
  const hasAnyEvidence = activities.some((activity) => hasEvidence(activity));

  return [
    {
      label: "At least 3 activities added",
      complete: activities.length >= 3,
      suggestion: "Add at least 3 activities to start filling your vault room.",
    },
    {
      label: "At least 1 volunteering activity",
      complete: hasCategory("Volunteering"),
      suggestion: "Add one volunteering activity to show service and community contribution.",
    },
    {
      label: "At least 1 club or leadership activity",
      complete: hasAnyCategory(["Club", "Leadership"]),
      suggestion: "Add one club, leadership, or project activity to make your vault feel balanced.",
    },
    {
      label: "At least 1 project activity",
      complete: hasCategory("Project"),
      suggestion: "Add one club, leadership, or project activity to make your vault feel balanced.",
    },
    {
      label: "At least 1 study, work, certificate, or award activity",
      complete: hasAnyCategory([
        "Study / Class",
        "Homework / Assignment",
        "Exam / Test Prep",
        "Reading / Research",
        "Work / Part-time Job",
        "Internship",
        "Certificate",
        "Award / Achievement",
      ]),
      suggestion: "Add a study, work, certificate, or award entry to give your room more variety.",
    },
    {
      label: "At least 3 activities have estimated hours",
      complete: withHours >= 3,
      suggestion: "Add weekly hours and dates for at least 3 activities so your commitment is easier to understand.",
    },
    {
      label: "At least 3 activities have skills written",
      complete: withSkills >= 3,
      suggestion: "Add skills to at least 3 activities so each object has a clearer story.",
    },
    {
      label: "At least 3 activities have impact/results written",
      complete: withImpact >= 3,
      suggestion: "Write impact/results for at least 3 activities.",
    },
    {
      label: "Total hours are at least 20",
      complete: totalHours >= 20,
      suggestion: "Add weekly hours and dates until your total reaches at least 20 estimated hours.",
    },
    {
      label: "At least 1 activity has a strong impact/result description",
      complete: hasStrongImpact,
      suggestion: "Write stronger impact/results for your activities.",
    },
    {
      label: "At least 1 activity has evidence/proof attached",
      complete: hasAnyEvidence,
      suggestion: "Attach proof for at least 1 activity, such as a certificate, link, photo, or report.",
    },
  ];
}

function getNextSteps(readinessItems) {
  const suggestions = [];

  readinessItems.forEach((item) => {
    if (!item.complete && !suggestions.includes(item.suggestion)) {
      suggestions.push(item.suggestion);
    }
  });

  if (suggestions.length === 0) {
    return [
      "Review your strongest objects and polish the wording before sharing your archive.",
      "Keep adding new room objects as you complete projects, service, classes, work, or awards.",
    ];
  }

  return suggestions.slice(0, 3);
}

function getReadinessSummary(readinessPercent) {
  if (readinessPercent >= 85) {
    return "Your vault room is well stocked. Keep polishing impact language and adding new objects.";
  }

  if (readinessPercent >= 55) {
    return "Your collection has a solid foundation. Add balance across shelves and strengthen outcomes.";
  }

  if (readinessPercent > 0) {
    return "Your room is starting to fill. Add more objects with estimated hours, skills, and impact details.";
  }

  return "Add activities to begin filling your vault room.";
}

function getPortfolioBadge(readinessPercent) {
  if (readinessPercent >= 85) {
    return ["Curated", "Your vault room feels full, balanced, and useful."];
  }

  if (readinessPercent >= 55) {
    return ["Organized", "Your collection has momentum. Add a few missing details next."];
  }

  if (readinessPercent > 0) {
    return ["Collector", "A few more complete objects will make the room feel lived-in."];
  }

  return ["Starter", "Add activities to unlock a cozier vault room."];
}

function getCategoryList() {
  return [...new Set(activities.map((activity) => getCategoryGroup(activity.category)).filter(Boolean))];
}

function renderRecentExperience() {
  const recentActivities = [...activities].sort((a, b) => getActivityTime(b) - getActivityTime(a)).slice(0, 4);

  if (recentActivities.length === 0) {
    statElements.recentExperienceList.innerHTML = `
      <div class="empty-inline">
        <p>Your room shelf is empty for now.</p>
        <a href="#add-activity">Add your first object</a>
      </div>
    `;
    return;
  }

  statElements.recentExperienceList.innerHTML = recentActivities
    .map(
      (activity) => `
        <article class="recent-item room-collectible" data-object="${escapeHTML(getCategoryGroup(activity.category))}">
          <div class="recent-icon">${renderCategoryVisual(activity.category)}</div>
          <div>
            <h3>${escapeHTML(activity.title)}</h3>
            <p>${escapeHTML(getCategoryObject(activity.category))} · ${escapeHTML(activity.organization) || "Organization not added"}</p>
          </div>
          <span class="recent-hours">${getTotalHours(activity).toLocaleString()} hrs</span>
        </article>
      `
    )
    .join("");
}

function renderVaultRoom() {
  if (!statElements.vaultRoomObjects || !statElements.vaultRoomEmpty) {
    return;
  }

  const visibleCount = activities.filter((activity) => !getRoomLayout(activity, getZoneIndexForActivity(activity)).hidden).length;
  statElements.vaultRoomEmpty.hidden = visibleCount > 0;
  document.body.classList.toggle("room-edit-mode", isRoomEditMode);

  if (editRoomButton) {
    editRoomButton.textContent = isRoomEditMode ? "Done" : "Edit Room";
  }

  const zoneCounts = {};

  const visibleActivities = activities.filter((activity) => !getRoomLayout(activity, getZoneIndexForActivity(activity)).hidden);

  statElements.vaultRoomObjects.innerHTML = visibleActivities
    .slice(0, 24)
    .map((activity, index) => {
      const config = getActivityObjectConfig(activity.category);
      const zoneIndex = zoneCounts[config.zone] || 0;
      const layout = getRoomLayout(activity, zoneIndex);
      const categoryGroup = getCategoryGroup(activity.category);
      zoneCounts[config.zone] = zoneIndex + 1;

      return `
        <button
          class="vault-room-object ${selectedRoomActivityId === activity.id ? "selected" : ""}"
          type="button"
          style="--x: ${layout.x}%; --y: ${layout.y}%; --size: ${layout.size}%; --rotation: ${layout.rotation}deg; --delay: ${Math.min(index, 12) * 55}ms;"
          data-id="${escapeHTML(activity.id)}"
          data-zone="${escapeHTML(config.zone)}"
          data-category="${escapeHTML(categoryGroup)}"
          aria-label="${escapeHTML(activity.title)}: ${escapeHTML(config.label)}"
          title="${escapeHTML(activity.title)} · ${escapeHTML(config.label)}"
        >
          <img src="${escapeHTML(layout.asset)}" alt="" aria-hidden="true" loading="lazy" draggable="false" />
          <span class="object-delete-control" aria-hidden="true">×</span>
          <span class="object-resize-handle" aria-hidden="true"></span>
          <span class="object-rotate-handle" aria-hidden="true"></span>
        </button>
      `;
    })
    .join("");

  renderRoomEditPanel();
  renderRoomArchive();
}

function renderRoomEditPanel() {
  if (!roomEditPanel || !roomEditTitle || !roomAssetSelect) {
    return;
  }

  const activity = getActivityById(selectedRoomActivityId);
  roomEditPanel.hidden = !isRoomEditMode || !activity;

  if (!activity) {
    return;
  }

  const zoneIndex = getZoneIndexForActivity(activity);
  const layout = getRoomLayout(activity, zoneIndex);
  const config = getActivityObjectConfig(activity.category);

  roomEditTitle.textContent = activity.title || "Selected object";
  roomAssetSelect.innerHTML = config.assets
    .map((asset) => {
      const assetName = decodeURIComponent(asset.replace("assets/", ""));
      return `<option value="${escapeHTML(asset)}" ${asset === layout.asset ? "selected" : ""}>${escapeHTML(assetName)}</option>`;
    })
    .join("");
}

function renderRoomArchive() {
  if (!roomArchiveList || !roomArchiveEmpty) {
    return;
  }

  const hiddenActivities = activities.filter((activity) =>
    getRoomLayout(activity, getZoneIndexForActivity(activity)).hidden
  );

  roomArchiveEmpty.hidden = hiddenActivities.length > 0;
  roomArchiveList.innerHTML = hiddenActivities
    .map((activity) => {
      const zoneIndex = getZoneIndexForActivity(activity);
      const layout = getRoomLayout(activity, zoneIndex);
      return `
        <article class="room-archive-item">
          <div class="room-archive-thumb">
            <img src="${escapeHTML(layout.asset)}" alt="" aria-hidden="true" loading="lazy" />
          </div>
          <div>
            <h3>${escapeHTML(activity.title || "Untitled activity")}</h3>
            <p>${escapeHTML(getCategoryGroup(activity.category))} · ${escapeHTML(activity.organization) || "Organization not added"}</p>
          </div>
          <button class="secondary-action restore-room-object" type="button" data-id="${escapeHTML(activity.id)}">Restore to Room</button>
        </article>
      `;
    })
    .join("");
}

function getZoneIndexForActivity(targetActivity) {
  const config = getActivityObjectConfig(targetActivity.category);
  return activities
    .slice(0, activities.findIndex((activity) => activity.id === targetActivity.id))
    .filter((activity) => getActivityObjectConfig(activity.category).zone === config.zone).length;
}

function renderExportActivityList() {
  selectedExportIds = new Set([...selectedExportIds].filter((id) => activities.some((activity) => activity.id === id)));
  exportNoActivities.hidden = activities.length > 0;

  if (activities.length === 0) {
    exportActivityList.innerHTML = "";
    return;
  }

  exportActivityList.innerHTML = activities
    .map(
      (activity) => `
        <label class="export-select-item">
          <input
            type="checkbox"
            value="${activity.id}"
            ${selectedExportIds.has(activity.id) ? "checked" : ""}
          />
          <span>
            <strong>${escapeHTML(activity.title)}</strong>
            <small>${escapeHTML(getCategoryGroup(activity.category))} • ${escapeHTML(activity.organization) || "Organization not added"} • ${escapeHTML(formatHours(activity))}</small>
          </span>
        </label>
      `
    )
    .join("");
}

function renderStats() {
  const totalHours = activities.reduce((sum, activity) => sum + getTotalHours(activity), 0);
  const categoriesUsed = new Set(activities.map((activity) => activity.category).filter(Boolean)).size;
  const readinessItems = getReadinessItems(totalHours);

  // Readiness rewards a useful mix: entries, detail, hours, and category variety.
  const readiness = Math.min(
    100,
    activities.length * 18 +
      categoriesUsed * 8 +
      Math.min(totalHours, 80) * 0.45 +
      activities.filter((activity) => activity.description && activity.impact && hasSkillValue(activity.skills)).length * 7 +
      activities.filter((activity) => hasEvidence(activity)).length * 6
  );

  statElements.totalActivities.textContent = activities.length;
  statElements.totalHours.textContent = totalHours.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  });
  statElements.categoriesUsed.textContent = categoriesUsed;
  const readinessPercent = Math.round(readiness);
  const [badgeTitle, badgeText] = getPortfolioBadge(readinessPercent);

  statElements.portfolioReadiness.textContent = `${readinessPercent}%`;
  statElements.portfolioRing.style.setProperty("--readiness-angle", `${readinessPercent * 3.6}deg`);
  statElements.readinessSummary.textContent = getReadinessSummary(readinessPercent);
  statElements.hoursProgress.style.width = `${Math.min(100, (totalHours / 20) * 100)}%`;
  statElements.portfolioBadge.textContent = badgeTitle;
  statElements.portfolioBadgeText.textContent = badgeText;
  statElements.categoryMiniList.innerHTML =
    getCategoryList()
      .slice(0, 4)
      .map((category) => `<span>${escapeHTML(category)}</span>`)
      .join("") || "<span>No categories yet</span>";
  statElements.readinessChecklist.innerHTML = readinessItems
    .map(
      (item) => `
        <li class="${item.complete ? "complete" : ""}">
          <span class="check-indicator" aria-hidden="true"></span>
          <span>${item.label}</span>
        </li>
      `
    )
    .join("");
  statElements.readinessNextSteps.innerHTML = getNextSteps(readinessItems)
    .map((suggestion) => `<li>${suggestion}</li>`)
    .join("");
  renderVaultRoom();
  renderRecentExperience();
  renderExportActivityList();
}

function getVisibleActivities() {
  return activities
    .filter((activity) => activeCategory === "All" || getCategoryGroup(activity.category) === activeCategory)
    .filter((activity) => {
      const searchableText = [
        activity.title,
        activity.organization,
        activity.category,
        getCategoryGroup(activity.category),
        activity.role,
        activity.description,
        formatSkills(activity.skills, ""),
        activity.impact,
        getEvidence(activity).title,
        getEvidence(activity).type,
        getEvidence(activity).url,
        getEvidence(activity).notes,
        activity.startDate,
        activity.endDate,
        activity.weeklyHours,
        activity.estimatedTotalHours,
        activity.totalHours,
        activity.hours,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchTerm);
    })
    .sort((activityA, activityB) => {
      if (sortBy === "oldest") {
        return getActivityTime(activityA) - getActivityTime(activityB);
      }

      if (sortBy === "hours") {
        return getTotalHours(activityB) - getTotalHours(activityA);
      }

      return getActivityTime(activityB) - getActivityTime(activityA);
    });
}

function groupActivitiesByCategory(selectedActivities) {
  return selectedActivities.reduce((groups, activity) => {
    const category = activity.category || "Other";
    groups[category] = groups[category] || [];
    groups[category].push(activity);
    return groups;
  }, {});
}

function getPolishedDescription(activity) {
  const description = trimEndingPunctuation(activity.description || `contributed to ${activity.title || "this activity"}`);
  const skills = formatSkills(activity.skills, "communication and organization");
  return `${sentenceCase(description)} while applying ${skills}.`;
}

function getImpactStatement(activity) {
  const impact = trimEndingPunctuation(activity.impact || "supported a meaningful outcome");
  return `Impact: ${sentenceCase(impact)}.`;
}

function renderDocumentHTML(text) {
  const lines = text.split("\n");

  return lines
    .map((line) => {
      if (!line.trim()) {
        return "";
      }

      if (line.startsWith("# ")) {
        return `<h1>${escapeHTML(line.slice(2))}</h1>`;
      }

      if (line.startsWith("## ")) {
        return `<h2>${escapeHTML(line.slice(3))}</h2>`;
      }

      if (line.startsWith("- ")) {
        return `<p class="document-bullet">${escapeHTML(line.slice(2))}</p>`;
      }

      return `<p>${escapeHTML(line)}</p>`;
    })
    .join("");
}

function addEvidenceLine(lines, activity) {
  const evidenceLine = getEvidenceLine(activity);

  if (evidenceLine) {
    lines.push(evidenceLine);
  }
}

function buildScholarshipDocument(selectedActivities) {
  const groups = groupActivitiesByCategory(selectedActivities);
  const lines = [
    "# Student Activity Summary",
    "",
    "This summary highlights selected activities that demonstrate commitment, initiative, skill development, and measurable contribution across school, community, and personal growth experiences.",
    "",
  ];

  Object.entries(groups).forEach(([category, groupedActivities]) => {
    lines.push(`## ${category}`);
    groupedActivities.forEach((activity) => {
      lines.push(
        activity.title || "Untitled Activity",
        `Organization: ${activity.organization || "Not added"}`,
        `Role: ${activity.role || "Participant"}`,
        `Dates: ${formatDateRange(activity)}`,
        `Weekly Hours: ${formatWeeklyHours(activity)}`,
        `Estimated Total Hours: ${formatEstimatedTotalHours(activity)}`,
        `Polished Description: ${getPolishedDescription(activity)}`,
        getImpactStatement(activity),
        `Skills Demonstrated: ${formatSkills(activity.skills, "Not specified")}`
      );
      addEvidenceLine(lines, activity);
      lines.push("");
    });
  });

  lines.push(
    "## Closing Reflection",
    "Together, these activities show consistent effort, developing responsibility, and a growing ability to connect everyday experiences with long-term academic and professional goals."
  );

  return lines.join("\n");
}

function buildResumeDocument(selectedActivities) {
  const lines = ["# Resume Experience Draft", ""];

  selectedActivities.forEach((activity) => {
    const heading = `${activity.role || activity.title || "Activity Participant"} — ${activity.organization || "Organization not added"}`;
    const output = getOutputText(activity);
    const evidence = getEvidence(activity);
    lines.push(
      `## ${heading}`,
      `Dates: ${formatDateRange(activity)} | Weekly Hours: ${formatWeeklyHours(activity)} | Estimated Total Hours: ${formatEstimatedTotalHours(activity)}`,
      `- ${output.resume}`,
      `- Demonstrated ${formatSkills(activity.skills, "transferable skills")} through ${activity.category || "student activity"} work with a clear contribution to ${trimEndingPunctuation(activity.impact || "the organization")}.`
    );

    if (evidence.type === "GitHub / Project" && evidence.url) {
      lines.push(`- Project link: ${evidence.url}`);
    }

    lines.push("");
  });

  return lines.join("\n");
}

function buildTransferDocument(selectedActivities) {
  const groups = groupActivitiesByCategory(selectedActivities);
  const lines = [
    "# Transfer Application Activity List",
    "",
    "The following activities are organized by category to show breadth of involvement, leadership potential, service orientation, project experience, and measurable impact.",
    "",
  ];

  Object.entries(groups).forEach(([category, groupedActivities]) => {
    lines.push(`## ${category}`);
    groupedActivities.forEach((activity) => {
      lines.push(
        `- ${activity.title || "Untitled Activity"} at ${activity.organization || "organization not added"} (${activity.role || "Participant"}, ${formatDateRange(activity)}, ${formatWeeklyHours(activity)}, ${formatEstimatedTotalHours(activity)} estimated total). ${getImpactStatement(activity)}`
      );
      addEvidenceLine(lines, activity);
    });
    lines.push("");
  });

  return lines.join("\n");
}

function buildPortfolioDocument(selectedActivities) {
  const lines = [
    "# Portfolio Summary",
    "",
    "This portfolio summary showcases selected student experiences, the skills developed through each activity, and the growth reflected in the outcomes.",
    "",
  ];

  selectedActivities.forEach((activity) => {
    lines.push(
      `## ${activity.title || "Untitled Activity"}`,
      `Category: ${activity.category || "Other"}`,
      `Organization: ${activity.organization || "Not added"}`,
      `Weekly Hours: ${formatWeeklyHours(activity)}`,
      `Estimated Total Hours: ${formatEstimatedTotalHours(activity)}`,
      `Showcase Summary: ${getPolishedDescription(activity)}`,
      `Skills: ${formatSkills(activity.skills, "Not specified")}`,
      `${getImpactStatement(activity)}`,
      `Growth Reflection: This experience helped build confidence, responsibility, and stronger readiness for future academic and professional opportunities.`,
    );
    addEvidenceLine(lines, activity);
    lines.push("");
  });

  return lines.join("\n");
}

function buildReportDocument(selectedActivities) {
  const totalSelectedHours = selectedActivities.reduce((sum, activity) => sum + getTotalHours(activity), 0);
  const allSkills = [
    ...new Set(
      selectedActivities
        .flatMap((activity) => getSkillArray(activity.skills))
        .map((skill) => skill.trim())
        .filter(Boolean)
    ),
  ];
  const lines = [
    "# Activity Participation Report",
    "",
    `Total Selected Estimated Hours: ${totalSelectedHours.toLocaleString()}`,
    "",
    "## Activity Breakdown",
  ];

  selectedActivities.forEach((activity) => {
    lines.push(
      `- ${activity.title || "Untitled Activity"} (${activity.category || "Other"}): ${formatWeeklyHours(activity)}, ${formatEstimatedTotalHours(activity)} estimated total with ${activity.organization || "organization not added"}. ${getImpactStatement(activity)}`
    );
    addEvidenceLine(lines, activity);
  });

  lines.push(
    "",
    "## Contribution Summary",
    "The selected activities reflect consistent participation, practical contribution, and a focus on outcomes that support the surrounding organization or community.",
    "",
    "## Skills and Outcomes",
    `Skills represented: ${allSkills.length ? allSkills.join(", ") : "Not added"}.`,
    "Outcomes include stronger collaboration, clearer communication, and documented impact across selected activities."
  );

  return lines.join("\n");
}

function buildExportDocument(selectedActivities, purpose) {
  if (purpose === "resume") {
    return buildResumeDocument(selectedActivities);
  }

  if (purpose === "transfer") {
    return buildTransferDocument(selectedActivities);
  }

  if (purpose === "portfolio") {
    return buildPortfolioDocument(selectedActivities);
  }

  if (purpose === "report") {
    return buildReportDocument(selectedActivities);
  }

  return buildScholarshipDocument(selectedActivities);
}

function generateExportDocument() {
  const selectedActivities = activities.filter((activity) => selectedExportIds.has(activity.id));
  documentFileName.textContent = exportFileNames[exportPurpose.value] || "ActivityVault_Export.txt";

  if (activities.length === 0) {
    exportSelectionWarning.hidden = true;
    generatedDocumentText = "";
    documentPreview.innerHTML = `<p class="document-placeholder">Add activities first before creating a backup.</p>`;
    return;
  }

  if (selectedActivities.length === 0) {
    exportSelectionWarning.hidden = false;
    generatedDocumentText = "";
    documentPreview.innerHTML = `<p class="document-placeholder">Select at least one activity to create a backup.</p>`;
    return;
  }

  exportSelectionWarning.hidden = true;
  generatedDocumentText = buildExportDocument(selectedActivities, exportPurpose.value);
  documentPreview.innerHTML = renderDocumentHTML(generatedDocumentText);
}

function refreshExportPreview() {
  if (selectedExportIds.size === 0 && activities.length > 0) {
    exportSelectionWarning.hidden = true;
    documentFileName.textContent = exportFileNames[exportPurpose.value] || "ActivityVault_Export.txt";
    generatedDocumentText = "";
    documentPreview.innerHTML = `<p class="document-placeholder">Select activities, choose a backup type, and create an export.</p>`;
    return;
  }

  generateExportDocument();
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function renderEvidenceSection(activity) {
  const evidence = getEvidence(activity);

  if (!hasEvidence(activity)) {
    return `<section class="evidence-block muted-evidence">No evidence added yet</section>`;
  }

  const urlMarkup = evidence.url
    ? isLinkValue(evidence.url)
      ? `<a href="${escapeHTML(getLinkHref(evidence.url))}" target="_blank" rel="noopener noreferrer">${escapeHTML(evidence.url)}</a>`
      : `<span>${escapeHTML(evidence.url)}</span>`
    : `<span>Not added</span>`;

  return `
    <section class="evidence-block" aria-label="Evidence for ${escapeHTML(activity.title)}">
      <div class="evidence-heading">
        <span class="detail-label">Evidence / Proof</span>
        ${evidence.type ? `<span class="evidence-type">${escapeHTML(evidence.type)}</span>` : ""}
      </div>
      <p><span class="detail-label">Title:</span> ${escapeHTML(evidence.title) || "Not added"}</p>
      <p><span class="detail-label">URL/File:</span> ${urlMarkup}</p>
      ${evidence.notes ? `<p><span class="detail-label">Notes:</span> ${escapeHTML(evidence.notes)}</p>` : ""}
    </section>
  `;
}

function renderSkillChips(skills) {
  const skillList = getSkillArray(skills);

  if (skillList.length === 0) {
    return `<span class="skills-empty">Not specified</span>`;
  }

  return skillList.map((skill) => `<span class="archive-skill-chip">${escapeHTML(skill)}</span>`).join("");
}

function renderActivities() {
  const visibleActivities = getVisibleActivities();

  emptyState.hidden = activities.length > 0;
  noMatchState.hidden = activities.length === 0 || visibleActivities.length > 0;

  activityList.innerHTML = visibleActivities
    .map(
      (activity) => `
        <article
          class="activity-card"
          data-id="${escapeHTML(activity.id)}"
          data-category="${escapeHTML(getCategoryGroup(activity.category))}"
          data-object="${escapeHTML(getCategoryObject(activity.category))}"
        >
          <div class="activity-card-header">
            <div class="activity-title">
              <span class="category-pill">
                <span class="category-icon">${renderCategoryVisual(activity.category)}</span>
                ${escapeHTML(getCategoryGroup(activity.category))}
              </span>
              <h3>${escapeHTML(activity.title)}</h3>
            </div>
            <div class="activity-card-actions">
              <button class="ai-improve-button" type="button" data-id="${activity.id}">Writing Helper</button>
              <button class="delete-button" type="button" data-id="${activity.id}">Delete</button>
            </div>
          </div>

          <div class="activity-meta">
            <p><span class="detail-label">Organization:</span> ${escapeHTML(activity.organization) || "Not added"}</p>
            <p><span class="detail-label">Role:</span> ${escapeHTML(activity.role) || "Not added"}</p>
            <p><span class="detail-label">Weekly Hours:</span> ${escapeHTML(formatWeeklyHours(activity))}</p>
            <p><span class="detail-label">Estimated Total Hours:</span> ${escapeHTML(formatEstimatedTotalHours(activity))}</p>
          </div>

          <div class="detail-grid">
            <p><span class="detail-label">Dates:</span> ${escapeHTML(formatDateRange(activity))}</p>
            <p><span class="detail-label">Description:</span> ${escapeHTML(activity.description) || "Not added"}</p>
            <div class="archive-skills-row">
              <span class="detail-label">Skills:</span>
              <div class="archive-skill-list">${renderSkillChips(activity.skills)}</div>
            </div>
            <p><span class="detail-label">Impact:</span> ${escapeHTML(activity.impact) || "Not added"}</p>
          </div>

          ${renderEvidenceSection(activity)}
          ${renderSavedWriting(activity)}
          <details class="writing-tools-details">
            <summary>Optional writing drafts</summary>
            ${renderOutputBuilder(activity)}
          </details>
        </article>
      `
    )
    .join("");

  renderStats();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const hoursEstimate = updateHoursEstimatePreview();

  if (hoursEstimate.status === "invalid") {
    weeklyHoursInput.focus();
    return;
  }

  activities = [getFormActivity(), ...activities];
  saveActivities();
  renderActivities();
  form.reset();
  selectedSkills = [];
  renderSelectedSkills();
  updateHoursEstimatePreview();
  document.querySelector("#title").focus();
});

[startDateInput, endDateInput, weeklyHoursInput].forEach((input) => {
  input.addEventListener("input", updateHoursEstimatePreview);
  input.addEventListener("change", updateHoursEstimatePreview);
});

addSkillButton.addEventListener("click", addSkillFromInput);

skillInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }

  event.preventDefault();
  addSkillFromInput();
});

selectedSkillsList.addEventListener("click", (event) => {
  const removeButton = event.target.closest("button[data-skill]");

  if (!removeButton) {
    return;
  }

  removeSelectedSkill(removeButton.dataset.skill);
});

suggestedSkillsList.addEventListener("click", (event) => {
  const suggestionButton = event.target.closest("button[data-skill]");

  if (!suggestionButton) {
    return;
  }

  addSelectedSkill(suggestionButton.dataset.skill);
});

editRoomButton?.addEventListener("click", () => {
  isRoomEditMode = !isRoomEditMode;

  if (!isRoomEditMode) {
    selectedRoomActivityId = "";
  }

  renderVaultRoom();
});

resetRoomLayout?.addEventListener("click", () => {
  resetAllRoomObjects();
});

resetSelectedObject?.addEventListener("click", () => {
  if (!selectedRoomActivityId) {
    return;
  }

  resetRoomObject(selectedRoomActivityId);
});

roomAssetSelect?.addEventListener("change", () => {
  if (!selectedRoomActivityId) {
    return;
  }

  updateRoomObject(selectedRoomActivityId, { asset: roomAssetSelect.value });
});

function hideRoomObject(activityId) {
  selectedRoomActivityId = selectedRoomActivityId === activityId ? "" : selectedRoomActivityId;
  updateRoomObject(activityId, { hidden: true, hiddenInRoom: true });
}

function restoreRoomObject(activityId) {
  updateRoomObject(activityId, { hidden: false, hiddenInRoom: false, roomDeleted: false });
}

roomArchiveList?.addEventListener("click", (event) => {
  const restoreButton = event.target.closest(".restore-room-object");

  if (!restoreButton) {
    return;
  }

  restoreRoomObject(restoreButton.dataset.id);
});

statElements.vaultRoomObjects?.addEventListener("pointerdown", (event) => {
  const objectButton = event.target.closest(".vault-room-object");

  if (!objectButton || !isRoomEditMode) {
    return;
  }

  event.preventDefault();

  if (event.target.closest(".object-delete-control")) {
    hideRoomObject(objectButton.dataset.id);
    return;
  }

  selectedRoomActivityId = objectButton.dataset.id;
  statElements.vaultRoomObjects
    ?.querySelectorAll(".vault-room-object")
    .forEach((roomObject) => roomObject.classList.toggle("selected", roomObject.dataset.id === selectedRoomActivityId));
  renderRoomEditPanel();

  const scene = document.querySelector(".vault-room-scene");
  const activity = getActivityById(selectedRoomActivityId);

  if (!scene || !activity) {
    return;
  }

  const zoneIndex = getZoneIndexForActivity(activity);
  const layout = getRoomLayout(activity, zoneIndex);
  const objectRect = objectButton.getBoundingClientRect();
  const sceneRect = scene.getBoundingClientRect();
  const center = getObjectCenterPercent(sceneRect, objectRect);
  const centerX = sceneRect.left + (center.x / 100) * sceneRect.width;
  const centerY = sceneRect.top + (center.y / 100) * sceneRect.height;
  const startDistance = Math.hypot(event.clientX - (objectRect.left + objectRect.width / 2), event.clientY - (objectRect.top + objectRect.height / 2));
  const isRotate = Boolean(event.target.closest(".object-rotate-handle"));
  const isResize = Boolean(event.target.closest(".object-resize-handle"));

  activeRoomInteraction = {
    id: selectedRoomActivityId,
    mode: isRotate ? "rotate" : isResize ? "resize" : "move",
    pointerId: event.pointerId,
    scene,
    layout,
    startSize: layout.size,
    startRotation: layout.rotation,
    startAngle: getPointerAngle(centerX, centerY, event.clientX, event.clientY),
    startDistance: Math.max(startDistance, 16),
    startObjectWidth: Math.max(objectRect.width, 16),
    startClientX: event.clientX,
    startClientY: event.clientY,
    center,
  };
  objectButton.setPointerCapture(event.pointerId);
});

document.querySelector(".vault-room-scene")?.addEventListener("pointerdown", (event) => {
  if (!isRoomEditMode || event.target.closest(".vault-room-object")) {
    return;
  }

  selectedRoomActivityId = "";
  statElements.vaultRoomObjects
    ?.querySelectorAll(".vault-room-object")
    .forEach((roomObject) => roomObject.classList.remove("selected"));
  renderRoomEditPanel();
});

statElements.vaultRoomObjects?.addEventListener("click", (event) => {
  const objectButton = event.target.closest(".vault-room-object");

  if (!objectButton || !isRoomEditMode) {
    return;
  }

  if (event.target.closest(".object-delete-control")) {
    hideRoomObject(objectButton.dataset.id);
    return;
  }

  selectedRoomActivityId = objectButton.dataset.id;
  statElements.vaultRoomObjects
    ?.querySelectorAll(".vault-room-object")
    .forEach((roomObject) => roomObject.classList.toggle("selected", roomObject.dataset.id === selectedRoomActivityId));
  renderRoomEditPanel();
});

window.addEventListener("pointermove", (event) => {
  if (!activeRoomInteraction) {
    return;
  }

  event.preventDefault();

  const rect = activeRoomInteraction.scene.getBoundingClientRect();
  const objectButton = statElements.vaultRoomObjects?.querySelector(`[data-id="${CSS.escape(activeRoomInteraction.id)}"]`);

  if (activeRoomInteraction.mode === "resize") {
    const deltaX = event.clientX - activeRoomInteraction.startClientX;
    const deltaY = event.clientY - activeRoomInteraction.startClientY;
    const dominantDelta = Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : deltaY;
    const nextPixelWidth = Math.max(16, activeRoomInteraction.startObjectWidth + dominantDelta);
    const nextSizePercent = (nextPixelWidth / rect.width) * 100;
    const size = clampNumber(nextSizePercent, ROOM_OBJECT_MIN_SIZE, ROOM_OBJECT_MAX_SIZE);

    activeRoomInteraction.layout = {
      ...activeRoomInteraction.layout,
      x: activeRoomInteraction.center.x,
      y: activeRoomInteraction.center.y,
      size,
      scale: 1,
    };
    setRoomObjectInMemory(activeRoomInteraction.id, activeRoomInteraction.layout);
    applyRoomObjectStyle(activeRoomInteraction.id);
    return;
  }

  if (activeRoomInteraction.mode === "rotate") {
    const centerX = rect.left + (activeRoomInteraction.center.x / 100) * rect.width;
    const centerY = rect.top + (activeRoomInteraction.center.y / 100) * rect.height;
    const angle = getPointerAngle(centerX, centerY, event.clientX, event.clientY);
    const rotation = clampNumber(activeRoomInteraction.startRotation + angle - activeRoomInteraction.startAngle, -180, 180);
    activeRoomInteraction.layout = {
      ...activeRoomInteraction.layout,
      x: activeRoomInteraction.center.x,
      y: activeRoomInteraction.center.y,
      rotation,
    };
    setRoomObjectInMemory(activeRoomInteraction.id, activeRoomInteraction.layout);
    applyRoomObjectStyle(activeRoomInteraction.id);
    return;
  }

  const x = clampNumber(((event.clientX - rect.left) / rect.width) * 100, 4, 96);
  const y = clampNumber(((event.clientY - rect.top) / rect.height) * 100, 5, 94);

  activeRoomInteraction.layout = {
    ...activeRoomInteraction.layout,
    x,
    y,
  };

  setRoomObjectInMemory(activeRoomInteraction.id, activeRoomInteraction.layout);

  if (objectButton) {
    objectButton.style.setProperty("--x", `${x}%`);
    objectButton.style.setProperty("--y", `${y}%`);
  }
});

window.addEventListener("pointerup", () => {
  if (!activeRoomInteraction) {
    return;
  }

  saveRoomLayouts();
  renderRoomEditPanel();
  activeRoomInteraction = null;
});

activityList.addEventListener("click", (event) => {
  const improveButton = event.target.closest(".ai-improve-button");
  if (improveButton) {
    openAiAssistant(improveButton.dataset.id);
    return;
  }

  const addDraftButton = event.target.closest(".add-draft-button");
  if (addDraftButton) {
    const activityCard = addDraftButton.closest(".activity-card");
    const activityId = activityCard?.dataset.id;
    const outputItem = addDraftButton.closest(".output-item");
    const outputText = outputItem?.querySelector(".output-text")?.textContent || "";
    const label = addDraftButton.dataset.draftLabel || outputItem?.dataset.draftLabel || "Saved Draft";

    if (activityId && outputText) {
      addWritingDraftToActivity(activityId, label, outputText);
    }

    return;
  }

  const copyButton = event.target.closest(".copy-button");
  if (copyButton) {
    const outputText = copyButton.closest(".output-item, .saved-writing-item")?.querySelector(".output-text")?.textContent || "";
    const originalText = copyButton.textContent;

    copyText(outputText, copyButton)
      .then(() => {
        copyButton.textContent = "Copied";
        setTimeout(() => {
          copyButton.textContent = originalText;
        }, 1400);
      })
      .catch(() => {
        copyButton.textContent = "Try again";
        setTimeout(() => {
          copyButton.textContent = originalText;
        }, 1400);
      });

    return;
  }

  const deleteButton = event.target.closest(".delete-button");

  if (!deleteButton) {
    return;
  }

  activities = activities.filter((activity) => activity.id !== deleteButton.dataset.id);
  selectedExportIds.delete(deleteButton.dataset.id);
  const { [deleteButton.dataset.id]: removedRoomLayout, ...remainingRoomLayouts } = roomLayouts;
  roomLayouts = remainingRoomLayouts;
  if (selectedRoomActivityId === deleteButton.dataset.id) {
    selectedRoomActivityId = "";
  }
  saveActivities();
  saveRoomLayouts();
  renderActivities();
});

closeAiAssistant.addEventListener("click", closeAiAssistantPanel);
aiAssistantBackdrop.addEventListener("click", closeAiAssistantPanel);

aiPurposeTabs.addEventListener("click", (event) => {
  const tab = event.target.closest("button[data-purpose]");

  if (!tab) {
    return;
  }

  activeAiPurpose = tab.dataset.purpose;
  renderAiAssistant();
});

retryAiDraft.addEventListener("click", renderAiAssistant);

copyAiDraft.addEventListener("click", () => {
  if (!activeAiDraft) {
    return;
  }

  const originalText = copyAiDraft.textContent;
  copyText(activeAiDraft.text, copyAiDraft)
    .then(() => {
      copyAiDraft.textContent = "Copied";
      setTimeout(() => {
        copyAiDraft.textContent = originalText;
      }, 1400);
    })
    .catch(() => {
      copyAiDraft.textContent = "Try again";
      setTimeout(() => {
        copyAiDraft.textContent = originalText;
      }, 1400);
    });
});

replaceDescription.addEventListener("click", () => {
  updateAiActivity((activity) => {
    activity.description = activeAiDraft.polishedDescription;
  });
});

replaceImpact.addEventListener("click", () => {
  updateAiActivity((activity) => {
    activity.impact = activeAiDraft.strongerImpact;
  });
});

saveAiDraft.addEventListener("click", () => {
  updateAiActivity((activity) => {
    activity.aiDrafts = {
      ...(activity.aiDrafts || {}),
      [activeAiPurpose]: activeAiDraft.text,
    };
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !aiAssistantModal.hidden) {
    closeAiAssistantPanel();
  }
});

exportActivityList.addEventListener("change", (event) => {
  const checkbox = event.target.closest('input[type="checkbox"]');

  if (!checkbox) {
    return;
  }

  if (checkbox.checked) {
    selectedExportIds.add(checkbox.value);
  } else {
    selectedExportIds.delete(checkbox.value);
  }

  exportSelectionWarning.hidden = true;
  refreshExportPreview();
});

selectAllActivities.addEventListener("click", () => {
  selectedExportIds = new Set(activities.map((activity) => activity.id));
  exportSelectionWarning.hidden = true;
  renderExportActivityList();
  refreshExportPreview();
});

clearActivitySelection.addEventListener("click", () => {
  selectedExportIds.clear();
  renderExportActivityList();
  refreshExportPreview();
});

generateDocument.addEventListener("click", generateExportDocument);

exportPurpose.addEventListener("change", refreshExportPreview);

copyDocument.addEventListener("click", () => {
  const textToCopy = generatedDocumentText || documentPreview.textContent.trim();

  if (!textToCopy) {
    return;
  }

  const originalText = copyDocument.textContent;
  copyText(textToCopy, copyDocument)
    .then(() => {
      copyDocument.textContent = "Copied";
      setTimeout(() => {
        copyDocument.textContent = originalText;
      }, 1400);
    })
    .catch(() => {
      copyDocument.textContent = "Try again";
      setTimeout(() => {
        copyDocument.textContent = originalText;
      }, 1400);
    });
});

printDocument.addEventListener("click", () => {
  if (!generatedDocumentText) {
    generateExportDocument();
  }

  window.print();
});

downloadDocument.addEventListener("click", () => {
  if (!generatedDocumentText) {
    generateExportDocument();
  }

  if (!generatedDocumentText) {
    return;
  }

  downloadTextFile("activityvault-export.txt", generatedDocumentText);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;

    filterButtons.forEach((filterButton) => {
      filterButton.classList.toggle("active", filterButton === button);
    });

    renderActivities();
  });
});

archiveSearch.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim().toLowerCase();
  renderActivities();
});

archiveSort.addEventListener("change", (event) => {
  sortBy = event.target.value;
  renderActivities();
});

window.addEventListener("hashchange", updateActiveNav);

documentFileName.textContent = exportFileNames[exportPurpose.value] || "ActivityVault_Export.txt";
migrateLegacyRoomLayouts();
updateHoursEstimatePreview();
renderSelectedSkills();
renderActivities();
updateActiveNav();
