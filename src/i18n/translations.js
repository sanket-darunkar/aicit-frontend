/**
 * AICIT – i18n Translations
 * Languages: English (en) | Marathi (mr) | Hindi (hi)
 *
 * Rules:
 * - Organization names, course names, cert numbers stay in English
 * - UI labels, nav, buttons, headings, form labels are translated
 * - Do NOT machine-translate organization-specific facts
 */

export const translations = {

  // ── Navigation ──────────────────────────────────────────────
  nav: {
    home:          { en: 'Home',                     mr: 'मुख्यपृष्ठ',        hi: 'होम' },
    about:         { en: 'About',                    mr: 'आमच्याबद्दल',       hi: 'हमारे बारे में' },
    studentInfo:   { en: 'Student Information',      mr: 'विद्यार्थी माहिती',  hi: 'छात्र जानकारी' },
    verify:        { en: 'Certificate Verification', mr: 'प्रमाणपत्र सत्यापन', hi: 'प्रमाणपत्र सत्यापन' },
    courses:       { en: 'All Courses',              mr: 'सर्व अभ्यासक्रम',    hi: 'सभी कोर्स' },
    gallery:       { en: 'Gallery',                  mr: 'गॅलरी',              hi: 'गैलरी' },
    contact:       { en: 'Contact',                  mr: 'संपर्क',              hi: 'संपर्क' },
    login:         { en: 'Login',                    mr: 'लॉगिन',               hi: 'लॉगिन' },
    instituteLogin:{ en: 'Institute Login',          mr: 'संस्था लॉगिन',       hi: 'संस्था लॉगिन' },
    adminLogin:    { en: 'Admin Login',              mr: 'प्रशासक लॉगिन',      hi: 'व्यवस्थापक लॉगिन' },
    registerInstitute:{ en: 'Register Institute',   mr: 'संस्था नोंदणी',       hi: 'संस्था पंजीकरण' },
    forRegistered: { en: 'For registered institutes',mr: 'नोंदणीकृत संस्थांसाठी', hi: 'पंजीकृत संस्थाओं के लिए' },
    mcaStaffOnly:  { en: 'MCA staff only',           mr: 'MCA कर्मचाऱ्यांसाठी', hi: 'MCA कर्मचारियों के लिए' },
  },

  // ── Hero ────────────────────────────────────────────────────
  hero: {
    eyebrow:    { en: 'Centralized Education & Certificate Platform', mr: 'केंद्रीकृत शिक्षण व प्रमाणपत्र प्लॅटफॉर्म', hi: 'केंद्रीकृत शिक्षा एवं प्रमाणपत्र प्लेटफ़ॉर्म' },
    title1:     { en: 'All India Council for',                        mr: 'ऑल इंडिया कौन्सिल फॉर',                    hi: 'ऑल इंडिया काउंसिल फॉर' },
    title2:     { en: 'Information Technology',                       mr: 'इन्फॉर्मेशन टेक्नॉलॉजी',                  hi: 'इंफॉर्मेशन टेक्नोलॉजी' },
    tagline:    { en: 'Empowering Institutes. Certifying Futures.',   mr: 'संस्थांना सक्षम करणे. भविष्य प्रमाणित करणे.', hi: 'संस्थाओं को सशक्त बनाना। भविष्य को प्रमाणित करना।' },
    desc:       { en: 'Empowering institutes across India to deliver quality computer education and issue verifiable certificates through a secure, centralized platform.', mr: 'भारतातील संस्थांना दर्जेदार संगणक शिक्षण देण्यासाठी आणि सुरक्षित, केंद्रीकृत प्लॅटफॉर्मद्वारे सत्यापित प्रमाणपत्रे जारी करण्यासाठी सक्षम करणे.', hi: 'भारत भर के संस्थानों को गुणवत्तापूर्ण कंप्यूटर शिक्षा देने और एक सुरक्षित, केंद्रीकृत प्लेटफ़ॉर्म के माध्यम से सत्यापन योग्य प्रमाणपत्र जारी करने के लिए सशक्त करना।' },
    ctaVerify:  { en: 'Verify Certificate',  mr: 'प्रमाणपत्र तपासा',    hi: 'प्रमाणपत्र सत्यापित करें' },
    ctaRegister:{ en: 'Register Your Institute', mr: 'संस्था नोंदणी करा', hi: 'अपनी संस्था पंजीकृत करें' },
    ctaCourses: { en: 'Explore Courses',     mr: 'अभ्यासक्रम पहा',       hi: 'कोर्स देखें' },
  },

  // ── Stats ───────────────────────────────────────────────────
  stats: {
    institutes:   { en: 'Affiliated Institutes', mr: 'संलग्न संस्था',         hi: 'संबद्ध संस्थाएँ' },
    students:     { en: 'Students Enrolled',     mr: 'नोंदणीकृत विद्यार्थी',  hi: 'नामांकित छात्र' },
    certificates: { en: 'Certificates Issued',   mr: 'जारी प्रमाणपत्रे',       hi: 'जारी प्रमाणपत्र' },
    courses:      { en: 'Courses Offered',        mr: 'उपलब्ध अभ्यासक्रम',     hi: 'उपलब्ध कोर्स' },
  },

  // ── Features / Why Choose Us ────────────────────────────────
  features: {
    heading:    { en: 'Why Choose AICIT?',          mr: 'AICIT का निवडावे?',         hi: 'AICIT क्यों चुनें?' },
    subheading: { en: 'Trusted by institutes across India for quality education and certified training.', mr: 'दर्जेदार शिक्षण आणि प्रमाणित प्रशिक्षणासाठी संपूर्ण भारतातील संस्थांचा विश्वास.', hi: 'गुणवत्तापूर्ण शिक्षा और प्रमाणित प्रशिक्षण के लिए भारत भर के संस्थानों द्वारा विश्वसनीय।' },
    bestTitle:  { en: 'Best In Industry',           mr: 'उद्योगातील सर्वोत्तम',      hi: 'उद्योग में सर्वश्रेष्ठ' },
    jobTitle:   { en: 'Job Oriented Courses',       mr: 'नोकरी-केंद्रित अभ्यासक्रम', hi: 'रोजगारपरक कोर्स' },
    staffTitle: { en: 'Professional Staff',         mr: 'व्यावसायिक कर्मचारी',       hi: 'पेशेवर कर्मचारी' },
    placementTitle:{ en: 'Placement Assistance',   mr: 'नोकरी सहाय्य',               hi: 'प्लेसमेंट सहायता' },
  },

  // ── Courses ─────────────────────────────────────────────────
  courses: {
    heading:    { en: 'Our Courses',           mr: 'आमचे अभ्यासक्रम',    hi: 'हमारे कोर्स' },
    subheading: { en: 'Industry-relevant programs designed to make you job-ready.', mr: 'उद्योग-संबंधित कार्यक्रम जे तुम्हाला नोकरीसाठी तयार करतात.', hi: 'उद्योग-प्रासंगिक कार्यक्रम जो आपको नौकरी के लिए तैयार करते हैं।' },
    duration:   { en: 'Duration',              mr: 'कालावधी',             hi: 'अवधि' },
    category:   { en: 'Category',              mr: 'श्रेणी',              hi: 'श्रेणी' },
    all:        { en: 'All Courses',           mr: 'सर्व अभ्यासक्रम',    hi: 'सभी कोर्स' },
    viewAll:    { en: 'View All Courses',      mr: 'सर्व अभ्यासक्रम पहा', hi: 'सभी कोर्स देखें' },
    enquireNow: { en: 'Enquire Now',           mr: 'आता चौकशी करा',       hi: 'अभी पूछताछ करें' },
    featured:   { en: 'Featured',             mr: 'वैशिष्ट्यपूर्ण',      hi: 'विशेष' },
    months:     { en: 'Months',               mr: 'महिने',                hi: 'महीने' },
    catComputer:{ en: 'Computer & IT',         mr: 'संगणक व IT',          hi: 'कंप्यूटर और IT' },
    catAccounting:{ en: 'Accounting & Finance',mr: 'लेखा व वित्त',         hi: 'लेखांकन और वित्त' },
    catDesign:  { en: 'Design & Media',        mr: 'डिझाईन व मीडिया',    hi: 'डिज़ाइन और मीडिया' },
    catTyping:  { en: 'Typing',                mr: 'टायपिंग',              hi: 'टाइपिंग' },
    catGovt:    { en: 'Government Exams',      mr: 'शासकीय परीक्षा',      hi: 'सरकारी परीक्षा' },
  },

  // ── Certificate Verification ────────────────────────────────
  verify: {
    heading:      { en: 'Certificate Verification',        mr: 'प्रमाणपत्र सत्यापन',         hi: 'प्रमाणपत्र सत्यापन' },
    subheading:   { en: 'Enter the certificate number to verify its authenticity instantly.', mr: 'प्रमाणपत्राची सत्यता त्वरित तपासण्यासाठी प्रमाणपत्र क्रमांक प्रविष्ट करा.', hi: 'प्रमाणपत्र की प्रामाणिकता तुरंत सत्यापित करने के लिए प्रमाणपत्र संख्या दर्ज करें।' },
    placeholder:  { en: 'AICIT-2026-000001',               mr: 'AICIT-2026-000001',            hi: 'AICIT-2026-000001' },
    label:        { en: 'Certificate Number',              mr: 'प्रमाणपत्र क्रमांक',          hi: 'प्रमाणपत्र संख्या' },
    btnVerify:    { en: 'Verify',                          mr: 'सत्यापित करा',                 hi: 'सत्यापित करें' },
    btnChecking:  { en: 'Checking...',                     mr: 'तपासत आहे...',                 hi: 'जाँच हो रही है...' },
    resultValid:  { en: 'Certificate Verified ✓',         mr: 'प्रमाणपत्र सत्यापित ✓',       hi: 'प्रमाणपत्र सत्यापित ✓' },
    resultRevoked:{ en: 'Certificate Revoked',            mr: 'प्रमाणपत्र रद्द केले',         hi: 'प्रमाणपत्र रद्द' },
    resultNotFound:{ en: 'Certificate Not Found',         mr: 'प्रमाणपत्र सापडले नाही',       hi: 'प्रमाणपत्र नहीं मिला' },
    authentic:    { en: 'This certificate is authentic and valid', mr: 'हे प्रमाणपत्र अस्सल आणि वैध आहे', hi: 'यह प्रमाणपत्र प्रामाणिक और वैध है' },
    certNo:       { en: 'Certificate Number',             mr: 'प्रमाणपत्र क्रमांक',           hi: 'प्रमाणपत्र संख्या' },
    studentName:  { en: 'Student Name',                   mr: 'विद्यार्थ्याचे नाव',           hi: 'छात्र का नाम' },
    course:       { en: 'Course',                         mr: 'अभ्यासक्रम',                    hi: 'कोर्स' },
    institute:    { en: 'Institute',                      mr: 'संस्था',                        hi: 'संस्था' },
    issueDate:    { en: 'Issue Date',                     mr: 'जारी तारीख',                    hi: 'जारी तिथि' },
    grade:        { en: 'Grade',                          mr: 'श्रेणी',                        hi: 'ग्रेड' },
    status:       { en: 'Status',                         mr: 'स्थिती',                        hi: 'स्थिति' },
    hintText:     { en: 'Certificate numbers begin with AICIT-', mr: 'प्रमाणपत्र क्रमांक AICIT- ने सुरू होतो', hi: 'प्रमाणपत्र संख्या AICIT- से शुरू होती है' },
    secure:       { en: 'Secure',        mr: 'सुरक्षित',    hi: 'सुरक्षित' },
    instant:      { en: 'Instant',       mr: 'त्वरित',      hi: 'तत्काल' },
    qrReady:      { en: 'QR Ready',      mr: 'QR तयार',    hi: 'QR तैयार' },
  },

  // ── About ───────────────────────────────────────────────────
  about: {
    heading:    { en: 'About AICIT',                mr: 'AICIT बद्दल',              hi: 'AICIT के बारे में' },
    mission:    { en: 'Our Mission',                mr: 'आमचे ध्येय',               hi: 'हमारा मिशन' },
    vision:     { en: 'Our Vision',                 mr: 'आमची दृष्टी',              hi: 'हमारा विजन' },
    established:{ en: 'Established',               mr: 'स्थापना',                  hi: 'स्थापना वर्ष' },
    registered: { en: 'Registered Organisation',   mr: 'नोंदणीकृत संस्था',         hi: 'पंजीकृत संगठन' },
  },

  // ── Contact ─────────────────────────────────────────────────
  contact: {
    heading:    { en: 'Get In Touch',               mr: 'संपर्क साधा',              hi: 'संपर्क करें' },
    subheading: { en: "Have questions? We'd love to hear from you.", mr: 'प्रश्न आहेत? आम्हाला ऐकायला आवडेल.', hi: 'सवाल हैं? हम आपसे सुनना पसंद करेंगे।' },
    name:       { en: 'Your Name',                  mr: 'तुमचे नाव',                hi: 'आपका नाम' },
    email:      { en: 'Email Address',              mr: 'ईमेल पत्ता',               hi: 'ईमेल पता' },
    mobile:     { en: 'Mobile Number',              mr: 'मोबाईल नंबर',              hi: 'मोबाइल नंबर' },
    subject:    { en: 'Subject',                    mr: 'विषय',                     hi: 'विषय' },
    message:    { en: 'Message',                    mr: 'संदेश',                    hi: 'संदेश' },
    send:       { en: 'Send Message',               mr: 'संदेश पाठवा',              hi: 'संदेश भेजें' },
    sending:    { en: 'Sending...',                 mr: 'पाठवत आहे...',             hi: 'भेज रहे हैं...' },
    success:    { en: 'Message sent! We will get back to you shortly.', mr: 'संदेश पाठवला! आम्ही लवकरच तुमच्याशी संपर्क साधू.', hi: 'संदेश भेजा गया! हम जल्द ही आपसे संपर्क करेंगे।' },
    address:    { en: 'Address',                    mr: 'पत्ता',                    hi: 'पता' },
    phone:      { en: 'Phone',                      mr: 'दूरध्वनी',                 hi: 'फ़ोन' },
    whatsapp:   { en: 'WhatsApp',                   mr: 'व्हॉट्सअॅप',               hi: 'व्हाट्सएप' },
  },

  // ── How It Works ────────────────────────────────────────────
  howItWorks: {
    heading:    { en: 'How It Works',               mr: 'हे कसे कार्य करते',        hi: 'यह कैसे काम करता है' },
    subheading: { en: 'Simple steps to get your institute on board and start issuing certificates.', mr: 'तुमची संस्था सामील करण्यासाठी आणि प्रमाणपत्रे जारी करण्यास सुरुवात करण्यासाठी सोप्या पायऱ्या.', hi: 'अपनी संस्था को जोड़ने और प्रमाणपत्र जारी करना शुरू करने के लिए सरल चरण।' },
    step1:      { en: 'Register',                   mr: 'नोंदणी करा',               hi: 'पंजीकरण करें' },
    step2:      { en: 'Get Approved',               mr: 'मंजुरी मिळवा',             hi: 'मंज़ूरी पाएं' },
    step3:      { en: 'Add Students',               mr: 'विद्यार्थी जोडा',          hi: 'छात्र जोड़ें' },
    step4:      { en: 'Issue Certificates',         mr: 'प्रमाणपत्रे द्या',         hi: 'प्रमाणपत्र जारी करें' },
    cta:        { en: 'Start Your Application',     mr: 'अर्ज सुरू करा',            hi: 'आवेदन शुरू करें' },
  },

  // ── Common UI ───────────────────────────────────────────────
  common: {
    learnMore:  { en: 'Learn More',   mr: 'अधिक जाणून घ्या', hi: 'अधिक जानें' },
    viewAll:    { en: 'View All',     mr: 'सर्व पहा',         hi: 'सभी देखें' },
    backHome:   { en: 'Back to Home', mr: 'मुख्यपृष्ठावर जा', hi: 'होम पर वापस जाएं' },
    loading:    { en: 'Loading...',   mr: 'लोड होत आहे...',  hi: 'लोड हो रहा है...' },
    error:      { en: 'Something went wrong. Please try again.', mr: 'काहीतरी चुकले. कृपया पुन्हा प्रयत्न करा.', hi: 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।' },
    search:     { en: 'Search',       mr: 'शोधा',             hi: 'खोजें' },
    cancel:     { en: 'Cancel',       mr: 'रद्द करा',         hi: 'रद्द करें' },
    confirm:    { en: 'Confirm',      mr: 'पुष्टी करा',       hi: 'पुष्टि करें' },
    save:       { en: 'Save',         mr: 'जतन करा',          hi: 'सहेजें' },
    close:      { en: 'Close',        mr: 'बंद करा',          hi: 'बंद करें' },
    required:   { en: 'Required',     mr: 'आवश्यक',           hi: 'आवश्यक' },
    optional:   { en: 'Optional',     mr: 'ऐच्छिक',           hi: 'वैकल्पिक' },
    submit:     { en: 'Submit',       mr: 'सबमिट करा',        hi: 'सबमिट करें' },
    next:       { en: 'Next',         mr: 'पुढे',             hi: 'अगला' },
    previous:   { en: 'Previous',     mr: 'मागे',             hi: 'पिछला' },
    download:   { en: 'Download',     mr: 'डाउनलोड',          hi: 'डाउनलोड' },
    noData:     { en: 'No data found', mr: 'कोणताही डेटा आढळला नाही', hi: 'कोई डेटा नहीं मिला' },
    comingSoon: { en: 'Coming Soon',  mr: 'लवकरच',            hi: 'जल्द आ रहा है' },
    issuedBy:   { en: 'Issued by AICIT', mr: 'AICIT द्वारे जारी', hi: 'AICIT द्वारा जारी' },
  },

  // ── Footer ──────────────────────────────────────────────────
  footer: {
    quickLinks: { en: 'Quick Links',         mr: 'द्रुत दुवे',           hi: 'त्वरित लिंक' },
    portal:     { en: 'Institute Portal',    mr: 'संस्था पोर्टल',        hi: 'संस्था पोर्टल' },
    legal:      { en: 'Legal',               mr: 'कायदेशीर',             hi: 'कानूनी' },
    verifyCert: { en: 'Verify Certificate',  mr: 'प्रमाणपत्र सत्यापित करा', hi: 'प्रमाणपत्र सत्यापित करें' },
    allRights:  { en: 'All rights reserved', mr: 'सर्व हक्क राखीव',      hi: 'सर्वाधिकार सुरक्षित' },
    tagline:    { en: 'A centralized education and certificate management platform for authorized institutes across India.', mr: 'भारतातील अधिकृत संस्थांसाठी एक केंद्रीकृत शिक्षण व प्रमाणपत्र व्यवस्थापन प्लॅटफॉर्म.', hi: 'भारत भर के अधिकृत संस्थानों के लिए एक केंद्रीकृत शिक्षा और प्रमाणपत्र प्रबंधन प्लेटफ़ॉर्म।' },
  },

  // ── Register Institute ──────────────────────────────────────
  register: {
    heading:    { en: 'Register Your Institute', mr: 'तुमची संस्था नोंदणी करा', hi: 'अपनी संस्था पंजीकृत करें' },
    step1:      { en: 'Institute Info',          mr: 'संस्था माहिती',            hi: 'संस्था जानकारी' },
    step2:      { en: 'Contact Person',          mr: 'संपर्क व्यक्ती',           hi: 'संपर्क व्यक्ति' },
    step3:      { en: 'Documents',               mr: 'कागदपत्रे',                hi: 'दस्तावेज़' },
    step4:      { en: 'Review',                  mr: 'पुनरावलोकन',               hi: 'समीक्षा' },
  },

  // ── Language names ──────────────────────────────────────────
  lang: {
    en: { en: 'English', mr: 'English', hi: 'English' },
    mr: { en: 'Marathi', mr: 'मराठी',  hi: 'मराठी' },
    hi: { en: 'Hindi',   mr: 'हिन्दी', hi: 'हिन्दी' },
  },
};

/** Helper: get a translation by key path and language */
export function t(keyPath, lang = 'en') {
  const keys = keyPath.split('.');
  let node = translations;
  for (const k of keys) {
    if (node == null) return keyPath;
    node = node[k];
  }
  if (node == null) return keyPath;
  return node[lang] ?? node['en'] ?? keyPath;
}
