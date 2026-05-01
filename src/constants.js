export const SLOT_HEIGHT = 52; // px per 30-min slot
export const START_HOUR = 9;
export const END_HOUR = 17;
export const TOTAL_SLOTS = (END_HOUR - START_HOUR) * 2; // 16
export const DAY_LABELS = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];
export const DAY_SHORT = ['Ma', 'Di', 'Wo', 'Do', 'Vr'];

export const PRIORITIES = [
  { value: 'hoog', label: 'Hoog', color: '#c0392b', bg: '#fce8e6' },
  { value: 'midden', label: 'Midden', color: '#d17a00', bg: '#fdf3e3' },
  { value: 'laag', label: 'Laag', color: '#5a8a3c', bg: '#ecf4e6' },
];

export const STATUSES = [
  { value: 'todo', label: 'To do', color: '#888', bg: '#f0f0f0' },
  { value: 'bezig', label: 'Bezig', color: '#c07a00', bg: '#fdf3e3' },
  { value: 'wachten', label: 'Wachten', color: '#b07000', bg: '#fff8e8' },
  { value: 'bespreken', label: 'Bespreken', color: '#c0392b', bg: '#fce8e6' },
  { value: 'live', label: 'Live ✓', color: '#2a7a4a', bg: '#e8f5ee' },
  { value: 'inrichten', label: 'In te richten', color: '#5b6fc4', bg: '#eceef8' },
  { value: 'done', label: 'Gedaan', color: '#5a8a3c', bg: '#ecf4e6' },
];

export const LABELS = [
  { value: 'S', label: 'Snel', color: '#2a9d8f', bg: '#e6f4f3' },
  { value: 'L', label: 'Langdurig', color: '#7b5ea7', bg: '#f2eef8' },
  { value: 'W', label: 'Wachten', color: '#c07a00', bg: '#fdf3e3' },
  { value: 'P', label: 'Project', color: '#5b6fc4', bg: '#eceef8' },
];

export const CATEGORIES = [
  { value: 'bb', label: 'Bouwbuddy', color: '#d4420a' },
  { value: 'bbm', label: 'BB Media', color: '#0a7c6e' },
  { value: 'persoonlijk', label: 'Persoonlijk', color: '#5b6fc4' },
];

export const INITIAL_PROJECTS = [
  { id: 'bb-jobmarketing', name: 'Jobmarketing & Dashboarding', category: 'bb', status: 'bespreken', description: 'Groeistrategie richting 100 plaatsingen loopt met Tsjibbe. CPQA nog niet op vacatureniveau meetbaar.', nextSteps: ['Campagne beheer overnemen bespreken', 'Dashboard CPQA bouwen via Claude Cowork'] },
  { id: 'bb-chatbot', name: 'Chatbot (Sleak)', category: 'bb', status: 'bezig', description: 'V1 is live. V2 in ontwikkeling — wordt daarna ook op de eigen Bouwbuddy site geplaatst.', nextSteps: ['V2 afmaken en live zetten'] },
  { id: 'bb-apollo', name: 'B2B Leads — Apollo', category: 'bb', status: 'inrichten', description: 'Pro abonnement aanwezig. Nog niet ingericht. Gecombineerd plan met BB Media.', nextSteps: ['Mogelijkheden Pro uitschrijven', 'Automatiseringsplan opstellen'] },
  { id: 'bb-funnel', name: 'Recruitment Funnel', category: 'bb', status: 'live', description: 'Funnel is up to date. Dashboard al gebouwd via Claude Cowork. Geen actie nodig.', nextSteps: [] },
  { id: 'bb-tools', name: 'Recruitment Tools', category: 'bb', status: 'bezig', description: 'Recruitrobin, Eva en Granola Business zijn actief in evaluatie.', nextSteps: ['Status per tool doorspreken en beslissen'] },
  { id: 'bb-social', name: 'Social Media BB', category: 'bb', status: 'bespreken', description: 'Wordt nu te weinig gepost. Stagiaire aanwezig die kan uitvoeren.', nextSteps: ['Content plan maken voor stagiaire'] },
  { id: 'bb-seo', name: 'SEO + Website', category: 'bb', status: 'bezig', description: 'Website live. SEO updates gedaan. Baby Loves Growth plaatst automatisch blogs.', nextSteps: ['Menuknop toevoegen → blog.bouwbuddy.nl'] },
  { id: 'bbm-leads', name: 'Lead Generatie', category: 'bbm', status: 'bezig', description: 'Apollo, demo website tool, Insta DM\'s en cold calling zijn actief.', nextSteps: ['API keys fixen demo tool', 'Apollo inrichten + automatiseren'] },
  { id: 'bbm-klanten', name: 'Klantprojecten', category: 'bbm', status: 'bezig', description: '3 actieve klantprojecten in Lovable. Per project bijhouden wat er nog openstaat.', nextSteps: [] },
  { id: 'bbm-sales', name: 'Sales & Werkproces', category: 'bbm', status: 'inrichten', description: 'Lead → klant flow aan het inrichten. Overeenkomsten, snelheid en presentatie nog te regelen.', nextSteps: ['Overeenkomst template opstellen', 'Sales flow vastleggen (DM → deal)'] },
  { id: 'bbm-website', name: 'Eigen Website BBM', category: 'bbm', status: 'bezig', description: 'Live op Lovable. SEO nog niet optimaal.', nextSteps: ['SEO technisch verbeteren'] },
  { id: 'bbm-social', name: 'Social Media (Instagram)', category: 'bbm', status: 'inrichten', description: 'Focus op Instagram. Nog geen vaste strategie of planning.', nextSteps: ['Content strategie opzetten'] },
  { id: 'persoonlijk', name: 'Persoonlijk / Algemeen', category: 'persoonlijk', status: 'bezig', description: 'Persoonlijke taken en algemene admin.', nextSteps: [] },
];

export const INITIAL_TASKS = [
  { id: 't1',  text: 'Indeed vacature-overzicht opnieuw uitdraaien (einde maand verstoort sponsoring)', projectId: 'bb-jobmarketing', priority: 'hoog',   labels: ['S'], status: 'todo', estimatedMinutes: 30,  scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't2',  text: 'Samenvatting meeting sturen naar leidinggevende',                                  projectId: 'persoonlijk',    priority: 'hoog',   labels: ['S'], status: 'todo', estimatedMinutes: 30,  scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't3',  text: 'Revolut card aanvullen → Baby Loves Growth SEO-abonnement actief',            projectId: 'bb-seo',         priority: 'hoog',   labels: ['S'], status: 'todo', estimatedMinutes: 15,  scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't4',  text: 'Menuknop toevoegen → blog.bouwbuddy.nl',                                      projectId: 'bb-seo',         priority: 'hoog',   labels: ['S'], status: 'todo', estimatedMinutes: 30,  scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't5',  text: 'API keys fixen demo website tool',                                                 projectId: 'bbm-leads',      priority: 'hoog',   labels: ['S'], status: 'todo', estimatedMinutes: 60,  scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't6',  text: 'TikTok account aanmaken voor BBL-functies',                                        projectId: 'bb-social',      priority: 'midden', labels: ['S'], status: 'todo', estimatedMinutes: 30,  scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't7',  text: 'Overeenkomst template opstellen BB Media',                                         projectId: 'bbm-sales',      priority: 'hoog',   labels: ['S'], status: 'todo', estimatedMinutes: 90,  scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't8',  text: 'Wekelijkse data-uitdraai regelen als tijdelijke dashboardoplossing',               projectId: 'bb-jobmarketing',priority: 'midden', labels: ['S'], status: 'todo', estimatedMinutes: 60,  scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't9',  text: 'Stefan bellen — campagne call inplannen, berichtenvoorstel doorsturen',        projectId: 'bb-jobmarketing',priority: 'hoog',   labels: ['S','W'], status: 'wachten', estimatedMinutes: 30, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't10', text: 'Cockpit support ticket opvolgen (data-ETL pilot — Robin opvolger)',           projectId: 'bb-tools',       priority: 'midden', labels: ['W','S'], status: 'wachten', estimatedMinutes: 15, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't11', text: 'Robin Junior pilot: inregeltijd opvragen, doel operationeel na bouwvak',          projectId: 'bb-tools',       priority: 'midden', labels: ['W','S'], status: 'wachten', estimatedMinutes: 15, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't12', text: 'Timo (Submedia) opvolgen: terugkoppeling website-eigendom overdracht',            projectId: 'bbm-website',    priority: 'midden', labels: ['W','S'], status: 'wachten', estimatedMinutes: 15, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't13', text: 'Meeting inplannen met Chibbe — campagnebeheer overnemen + dashboard',         projectId: 'bb-jobmarketing',priority: 'hoog',   labels: ['W','S'], status: 'wachten', estimatedMinutes: 30, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't14', text: 'Status Recruitrobin, Eva en Granola doorspreken',                                 projectId: 'bb-tools',       priority: 'midden', labels: ['S','W'], status: 'wachten', estimatedMinutes: 60, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't15', text: 'Apollo Pro activeren + sequences instellen (Bouwbuddy én BB Media)',         projectId: 'bb-apollo',      priority: 'hoog',   labels: ['L','P'], status: 'todo', estimatedMinutes: 180, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't16', text: 'Apollo volledig inrichten en automatiseren',                                      projectId: 'bb-apollo',      priority: 'hoog',   labels: ['L','P'], status: 'todo', estimatedMinutes: 240, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't17', text: 'ZZP-plan uitwerken: regelgeving + aanpak bedrijven benaderen',                   projectId: 'bb-jobmarketing',priority: 'midden', labels: ['L','P'], status: 'todo', estimatedMinutes: 120, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't18', text: 'Sleek chatbot v2 (stuurt op telefoongesprekken) live zetten',                    projectId: 'bb-chatbot',     priority: 'midden', labels: ['L','P'], status: 'bezig', estimatedMinutes: 120, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't19', text: 'Chatbot prompt verbeteren: werkzoekende vs. werkgever splitsing',                projectId: 'bb-chatbot',     priority: 'laag',   labels: ['S'],     status: 'todo', estimatedMinutes: 60, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't20', text: '"Ik zoek personeel" pagina herschrijven + in Umbraco plaatsen',              projectId: 'bb-seo',         priority: 'midden', labels: ['L'],     status: 'todo', estimatedMinutes: 120, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't21', text: 'Meta Ads campagne opzetten op basis groeistrategie (€1.000/maand)',          projectId: 'bb-jobmarketing',priority: 'midden', labels: ['L','P'], status: 'todo', estimatedMinutes: 180, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't22', text: 'Google Display remarketing inrichten voor websitebezoekers',                     projectId: 'bb-jobmarketing',priority: 'laag',   labels: ['L'],     status: 'todo', estimatedMinutes: 120, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't23', text: 'Cockpit API-toegang aanvragen (nodig voor Robin Junior integratie)',             projectId: 'bb-tools',       priority: 'midden', labels: ['L'],     status: 'todo', estimatedMinutes: 60, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't24', text: 'Referral bonusprogramma opzetten (bijv. €250)',                             projectId: 'bb-funnel',      priority: 'laag',   labels: ['L','P'], status: 'todo', estimatedMinutes: 120, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't25', text: 'Video content produceren van bestaand materiaal voor social media',              projectId: 'bb-social',      priority: 'laag',   labels: ['L'],     status: 'todo', estimatedMinutes: 180, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't26', text: 'Dashboard CPQA bouwen via Claude Cowork',                                        projectId: 'bb-jobmarketing',priority: 'midden', labels: ['L','P'], status: 'todo', estimatedMinutes: 240, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't27', text: 'Groeistrategie 100 plaatsingen afronden met Chibbe',                            projectId: 'bb-jobmarketing',priority: 'hoog',   labels: ['W','L'], status: 'wachten', estimatedMinutes: 60, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't28', text: 'Social media content plan voor stagiaire',                                       projectId: 'bb-social',      priority: 'midden', labels: ['L','W'], status: 'todo', estimatedMinutes: 120, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't29', text: 'Sales flow vastleggen (DM → deal) BB Media',                               projectId: 'bbm-sales',      priority: 'midden', labels: ['L','P'], status: 'todo', estimatedMinutes: 120, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't30', text: 'Lead lijst koppelen aan demo website tool',                                      projectId: 'bbm-leads',      priority: 'midden', labels: ['L'],     status: 'todo', estimatedMinutes: 90, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't31', text: 'SEO verbeteren eigen website BB Media',                                          projectId: 'bbm-website',    priority: 'laag',   labels: ['L'],     status: 'todo', estimatedMinutes: 120, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
  { id: 't32', text: 'Instagram content strategie BB Media opzetten',                                  projectId: 'bbm-social',     priority: 'laag',   labels: ['L','P'], status: 'todo', estimatedMinutes: 120, scheduledDate: null, scheduledSlot: null, recurring: false, done: false },
];

export const INITIAL_RECURRING = [
  { id: 'rec1', text: 'Maandagochtend: To Do\'s aanvullen + projecten bekijken', projectId: 'persoonlijk', priority: 'hoog', labels: ['P'], status: 'todo', estimatedMinutes: 60, recurringDays: [1], recurringTime: '09:00', doneWeeks: [] },
  { id: 'rec2', text: 'Dinsdag: Weekly meeting voorbereiden',                   projectId: 'persoonlijk', priority: 'midden', labels: ['P'], status: 'todo', estimatedMinutes: 30, recurringDays: [2], recurringTime: '09:00', doneWeeks: [] },
  { id: 'rec3', text: 'Donderdag 15:00: Meeting voorbereiden',                  projectId: 'persoonlijk', priority: 'hoog', labels: ['P'], status: 'todo', estimatedMinutes: 60, recurringDays: [4], recurringTime: '14:00', doneWeeks: [] },
];
