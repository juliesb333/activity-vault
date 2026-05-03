const STORAGE_KEY = "activityVault.activities";

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
};

let activities = loadActivities();
let activeCategory = "All";
let searchTerm = "";
let sortBy = "newest";
let selectedExportIds = new Set();
let generatedDocumentText = "";
let selectedSkills = [];

const exportFileNames = {
  scholarship: "Scholarship_Activity_Summary.txt",
  resume: "Resume_Experience_Draft.txt",
  transfer: "Transfer_Activity_List.txt",
  portfolio: "Portfolio_Summary.txt",
  report: "Activity_Participation_Report.txt",
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

function renderOutputBuilder(activity) {
  const outputs = getOutputText(activity);
  const outputItems = [
    ["Resume Bullet", outputs.resume],
    ["Scholarship Reflection", outputs.reflection],
    ["Portfolio Summary", outputs.portfolio],
  ];

  return `
    <section class="output-builder" aria-label="Output Builder for ${escapeHTML(activity.title)}">
      <div class="output-heading">
        <span class="detail-label">Output Builder</span>
        <span>Template generated</span>
      </div>

      <div class="output-list">
        ${outputItems
          .map(
            ([label, text]) => `
              <article class="output-item">
                <div class="output-item-header">
                  <h4>${label}</h4>
                  <button class="copy-button" type="button">Copy</button>
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
  const hasCategory = (category) => activities.some((activity) => activity.category === category);
  const hasAnyCategory = (categories) => activities.some((activity) => categories.includes(activity.category));
  const withHours = activities.filter((activity) => getTotalHours(activity) > 0).length;
  const withSkills = activities.filter((activity) => hasSkillValue(activity.skills)).length;
  const withImpact = activities.filter((activity) => (activity.impact || "").trim().length > 0).length;
  const hasStrongImpact = activities.some((activity) => (activity.impact || "").trim().length >= 70);
  const hasAnyEvidence = activities.some((activity) => hasEvidence(activity));

  return [
    {
      label: "At least 3 activities added",
      complete: activities.length >= 3,
      suggestion: "Add at least 3 activities to start building your portfolio.",
    },
    {
      label: "At least 1 volunteering activity",
      complete: hasCategory("Volunteering"),
      suggestion: "Add one volunteering activity to show service and community contribution.",
    },
    {
      label: "At least 1 leadership activity",
      complete: hasCategory("Leadership"),
      suggestion: "Add one leadership or project activity to make your portfolio more balanced.",
    },
    {
      label: "At least 1 project activity",
      complete: hasCategory("Project"),
      suggestion: "Add one leadership or project activity to make your portfolio more balanced.",
    },
    {
      label: "At least 1 work, certificate, competition, or academic activity",
      complete: hasAnyCategory(["Work", "Certificate", "Competition", "Academic"]),
      suggestion: "Add a work, certificate, competition, or academic entry to show range.",
    },
    {
      label: "At least 3 activities have estimated hours",
      complete: withHours >= 3,
      suggestion: "Add weekly hours and dates for at least 3 activities so your commitment is easier to understand.",
    },
    {
      label: "At least 3 activities have skills written",
      complete: withSkills >= 3,
      suggestion: "Add skills to at least 3 activities to connect your experience to strengths.",
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
      "Review your strongest activities and polish the wording before sharing your portfolio.",
      "Keep adding new experiences as you complete projects, service, or awards.",
    ];
  }

  return suggestions.slice(0, 3);
}

function getReadinessSummary(readinessPercent) {
  if (readinessPercent >= 85) {
    return "Your portfolio is strong. Keep polishing impact language and adding new milestones.";
  }

  if (readinessPercent >= 55) {
    return "You have a solid foundation. Add balance across categories and strengthen outcomes.";
  }

  if (readinessPercent > 0) {
    return "You are getting started. Add more activities with estimated hours, skills, and impact details.";
  }

  return "Add activities to begin measuring your portfolio readiness.";
}

function getPortfolioBadge(readinessPercent) {
  if (readinessPercent >= 85) {
    return ["Ready", "Scholarship and resume materials are taking shape."];
  }

  if (readinessPercent >= 55) {
    return ["Growing", "Your archive has momentum. Fill the missing checklist items next."];
  }

  if (readinessPercent > 0) {
    return ["Starter", "A few more complete entries will make this feel portfolio-ready."];
  }

  return ["Starter", "Add activities to unlock a stronger profile."];
}

function getCategoryList() {
  return [...new Set(activities.map((activity) => activity.category).filter(Boolean))];
}

function renderRecentExperience() {
  const recentActivities = [...activities].sort((a, b) => getActivityTime(b) - getActivityTime(a)).slice(0, 4);

  if (recentActivities.length === 0) {
    statElements.recentExperienceList.innerHTML = `
      <div class="empty-inline">
        <p>No recent entries yet.</p>
        <a href="#add-activity">Add your first activity</a>
      </div>
    `;
    return;
  }

  statElements.recentExperienceList.innerHTML = recentActivities
    .map(
      (activity) => `
        <article class="recent-item">
          <div class="recent-icon">${escapeHTML((activity.category || "A").charAt(0))}</div>
          <div>
            <h3>${escapeHTML(activity.title)}</h3>
            <p>${escapeHTML(activity.category)} • ${escapeHTML(activity.organization) || "Organization not added"}</p>
          </div>
          <span class="recent-hours">${getTotalHours(activity).toLocaleString()} hrs</span>
        </article>
      `
    )
    .join("");
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
            <small>${escapeHTML(activity.category)} • ${escapeHTML(activity.organization) || "Organization not added"} • ${escapeHTML(formatHours(activity))}</small>
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
  renderRecentExperience();
  renderExportActivityList();
}

function getVisibleActivities() {
  return activities
    .filter((activity) => activeCategory === "All" || activity.category === activeCategory)
    .filter((activity) => {
      const searchableText = [
        activity.title,
        activity.organization,
        activity.category,
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
    documentPreview.innerHTML = `<p class="document-placeholder">Add activities first before generating an export document.</p>`;
    return;
  }

  if (selectedActivities.length === 0) {
    exportSelectionWarning.hidden = false;
    generatedDocumentText = "";
    documentPreview.innerHTML = `<p class="document-placeholder">Select at least one activity to generate a document.</p>`;
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
    documentPreview.innerHTML = `<p class="document-placeholder">Select activities, choose an export purpose, and generate a document.</p>`;
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
        <article class="activity-card" data-category="${escapeHTML(activity.category)}">
          <div class="activity-card-header">
            <div class="activity-title">
              <span class="category-pill">${escapeHTML(activity.category)}</span>
              <h3>${escapeHTML(activity.title)}</h3>
            </div>
            <button class="delete-button" type="button" data-id="${activity.id}">Delete</button>
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
          ${renderOutputBuilder(activity)}
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

activityList.addEventListener("click", (event) => {
  const copyButton = event.target.closest(".copy-button");
  if (copyButton) {
    const outputText = copyButton.closest(".output-item").querySelector(".output-text").textContent;
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
  saveActivities();
  renderActivities();
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
updateHoursEstimatePreview();
renderSelectedSkills();
renderActivities();
updateActiveNav();
