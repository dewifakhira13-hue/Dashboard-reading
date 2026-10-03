import { readFileSync } from 'fs';

// Complete Google Apps Script template for Google Sheets
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ===============================================================================================
 * AI ENGLISH READING TEACHER DASHBOARD - GOOGLE APPS SCRIPT (Code.gs)
 * ===============================================================================================
 * Author: English Reading Teacher Dashboard System
 * Target: Google Sheets + Google Apps Script Web App
 * 
 * PETUNJUK INSTALASI CEPAT:
 * 1. Buka Google Sheets baru di https://sheets.new
 * 2. Beri nama file: "AI English Reading Dashboard - Database SMP"
 * 3. Klik menu: Extensions (Ekstensi) > Apps Script
 * 4. Hapus seluruh isi default Code.gs, lalu PASTE seluruh kode di bawah ini.
 * 5. Klik ikon Save (Disket).
 * 6. Di dropdown fungsi toolbar atas, pilih "setupSheetsAndFormulas", lalu klik "Run" (Jalankan).
 *    (Izinkan akses akun Google Anda jika diminta).
 * 7. (Opsional) Pilih "populateSampleData" lalu klik "Run" jika ingin mengisi 30 data demo.
 * 8. Klik tombol biru: Deploy (Terapkan) > New deployment (Penerapan baru).
 *    - Pilih type: Web app (Aplikasi web)
 *    - Description: "English Reading Dashboard API v1"
 *    - Execute as: "Me" (email Anda)
 *    - Who has access: "Anyone" (Siapa saja - agar dashboard dapat membaca data tanpa error login)
 * 9. Klik "Deploy" dan SALIN "Web app URL" (yang berakhiran /exec).
 * 10. Paste Web app URL tersebut ke dalam Teacher Dashboard pada panel "Google Sheets Connection".
 * ===============================================================================================
 */

// -----------------------------------------------------------------------------------------------
// 1. SETUP SHEETS & FORMULAS (Jalankan ini sekali saat pertama kali membuat)
// -----------------------------------------------------------------------------------------------
function setupSheetsAndFormulas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Sheet 1: README
  let sheetReadme = ss.getSheetByName('README');
  if (!sheetReadme) sheetReadme = ss.insertSheet('README', 0);
  sheetReadme.clear();
  sheetReadme.getRange('A1:B8').setValues([
    ['PURPOSE', 'Template data structure for the AI English Reading Teacher Dashboard.'],
    ['TEACHER INPUT', 'Teachers can add/edit students and enter one row per student per reading session.'],
    ['READING', 'Main Idea, Specific Information, Inference, Vocabulary in Context.'],
    ['ENGAGEMENT', 'Task Completion, Response Time, Engagement.'],
    ['AFFECTIVE', 'Confidence, Reading Anxiety, Motivation.'],
    ['AI', 'AI interprets patterns and proposes pedagogical actions; teacher remains final decision maker.'],
    ['SAMPLE DATA', 'Starter IDs and rows provided.'],
    ['AI STUDIO', 'Use Reading_Data_Input as the main dataset specification.']
  ]);
  sheetReadme.getRange('A1:A8').setFontWeight('bold').setFontColor('#082B5F');

  // Sheet 2: Teacher_Student_Input
  let sheetStudent = ss.getSheetByName('Teacher_Student_Input');
  if (!sheetStudent) sheetStudent = ss.insertSheet('Teacher_Student_Input', 1);
  if (sheetStudent.getLastRow() === 0) {
    sheetStudent.appendRow(['Teacher Student Input', '', '', '', '', '', '', '']);
    sheetStudent.appendRow(['Guru dapat menambah siswa sendiri. Satu baris = satu siswa.', '', '', '', '', '', '', '']);
    sheetStudent.appendRow(['', '', '', '', '', '', '', '']);
    sheetStudent.appendRow(['Student_ID', 'Date', 'Student_Name', 'School', 'Class', 'Grade', 'Teacher_Name', 'Active']);
    
    sheetStudent.getRange('A1:H1').setBackground('#082B5F').setFontColor('#FFFFFF').setFontWeight('bold');
    sheetStudent.getRange('A4:H4').setBackground('#1677E8').setFontColor('#FFFFFF').setFontWeight('bold');
  }

  // Sheet 3: Reading_Data_Input
  let sheetReading = ss.getSheetByName('Reading_Data_Input');
  if (!sheetReading) sheetReading = ss.insertSheet('Reading_Data_Input', 2);
  if (sheetReading.getLastRow() === 0) {
    sheetReading.appendRow(['Reading Data Input']);
    sheetReading.appendRow(['Guru memasukkan satu baris untuk setiap siswa pada setiap reading session.']);
    sheetReading.appendRow(['']);
    sheetReading.appendRow([
      'Student_ID', 'Student_Name', 'Class', 'Session',
      'Reading_Text_ID', 'Reading_Text_Title', 'Text_Type', 'Text_Level',
      'Reading_Score', 'Main_Idea_Score', 'Specific_Information_Score',
      'Inference_Score', 'Vocabulary_in_Context_Score', 'Task_Completion_Percent',
      'Response_Time_Seconds', 'Engagement_1to5', 'Confidence_1to5',
      'Reading_Anxiety_1to5', 'Motivation_1to5', 'Performance_Level'
    ]);

    sheetReading.getRange('A1:T1').setBackground('#082B5F').setFontColor('#FFFFFF').setFontWeight('bold');
    sheetReading.getRange('A4:T4').setBackground('#1677E8').setFontColor('#FFFFFF').setFontWeight('bold');
  }

  // Sheet 4: Dashboard_Summary
  let sheetSummary = ss.getSheetByName('Dashboard_Summary');
  if (!sheetSummary) sheetSummary = ss.insertSheet('Dashboard_Summary', 3);
  sheetSummary.clear();
  sheetSummary.appendRow(['Dashboard Summary']);
  sheetSummary.appendRow(['Ringkasan formula untuk KPI dan grafik dashboard.']);
  sheetSummary.appendRow(['']);
  sheetSummary.appendRow([
    'Session', 'Total Students', 'Avg Reading Score', 'Avg Task Completion',
    'Avg Engagement', 'Avg Confidence', 'Avg Anxiety', 'Avg Motivation'
  ]);
  
  for (let s = 1; s <= 5; s++) {
    const sName = 'Session ' + s;
    sheetSummary.appendRow([
      sName,
      '=COUNTIF(Reading_Data_Input!$D$5:$D, "' + sName + '")',
      '=AVERAGEIF(Reading_Data_Input!$D$5:$D, "' + sName + '", Reading_Data_Input!$I$5:$I)',
      '=AVERAGEIF(Reading_Data_Input!$D$5:$D, "' + sName + '", Reading_Data_Input!$N$5:$N)',
      '=AVERAGEIF(Reading_Data_Input!$D$5:$D, "' + sName + '", Reading_Data_Input!$P$5:$P)',
      '=AVERAGEIF(Reading_Data_Input!$D$5:$D, "' + sName + '", Reading_Data_Input!$Q$5:$Q)',
      '=AVERAGEIF(Reading_Data_Input!$D$5:$D, "' + sName + '", Reading_Data_Input!$R$5:$R)',
      '=AVERAGEIF(Reading_Data_Input!$D$5:$D, "' + sName + '", Reading_Data_Input!$S$5:$S)'
    ]);
  }

  // Sheet 5: AI_Insights_Input
  let sheetAI = ss.getSheetByName('AI_Insights_Input');
  if (!sheetAI) sheetAI = ss.insertSheet('AI_Insights_Input', 4);
  if (sheetAI.getLastRow() === 0) {
    sheetAI.appendRow(['AI Insights & Recommendations Input']);
    sheetAI.appendRow(['Teacher observations are optional. AI generates insight and suggested actions.']);
    sheetAI.appendRow(['']);
    sheetAI.appendRow([
      'Student_ID', 'Teacher_Observation', 'Priority',
      'AI_Insight', 'Suggested_Action', 'Teacher_Decision', 'Teacher_Comment'
    ]);
    sheetAI.getRange('A1:G1').setBackground('#082B5F').setFontColor('#FFFFFF').setFontWeight('bold');
    sheetAI.getRange('A4:G4').setBackground('#1677E8').setFontColor('#FFFFFF').setFontWeight('bold');
  }

  // Sheet 6: Data_Dictionary
  let sheetDict = ss.getSheetByName('Data_Dictionary');
  if (!sheetDict) sheetDict = ss.insertSheet('Data_Dictionary', 5);
  sheetDict.clear();
  sheetDict.appendRow(['Data Dictionary']);
  sheetDict.appendRow(['Definitions used by the dashboard and AI prompt.']);
  sheetDict.appendRow(['']);
  sheetDict.appendRow(['Field', 'Definition', 'Scale/Type', 'Dashboard Use', 'Input By']);
  const dictRows = [
    ['Reading_Score', 'Overall reading comprehension', '0-100', 'KPI / performance', 'Teacher'],
    ['Main_Idea_Score', 'Ability to identify main idea', '0-100', 'Skill chart', 'Teacher'],
    ['Specific_Information_Score', 'Ability to find explicit information', '0-100', 'Skill chart', 'Teacher'],
    ['Inference_Score', 'Ability to infer meaning/conclusions', '0-100', 'Skill chart', 'Teacher'],
    ['Vocabulary_in_Context_Score', 'Ability to infer word meaning from context', '0-100', 'Skill chart', 'Teacher'],
    ['Task_Completion_Percent', 'Assigned reading task completed', '0-100', 'KPI', 'Teacher'],
    ['Response_Time_Seconds', 'Time used to complete task', 'seconds', 'Analytics', 'Teacher'],
    ['Engagement_1to5', 'Engagement level', '1-5', 'Affective/engagement', 'Teacher'],
    ['Confidence_1to5', 'Confidence in reading English', '1-5', 'Affective', 'Teacher'],
    ['Reading_Anxiety_1to5', 'Reading anxiety; higher = more anxiety', '1-5', 'Affective', 'Teacher'],
    ['Motivation_1to5', 'Motivation to learn reading', '1-5', 'Affective', 'Teacher'],
    ['Performance_Level', 'Automatic performance category', 'Excellent/Good/Fair/Needs Support', 'Distribution', 'Formula'],
    ['AI_Insight', 'AI interpretation of data patterns', 'Text', 'AI Insights', 'AI'],
    ['Suggested_Action', 'AI-generated pedagogical recommendation', 'Text', 'Recommendations', 'AI'],
    ['Teacher_Decision', 'Teacher final decision on recommendation', 'Accept/Modify/Reject/Pending', 'Human-in-the-loop', 'Teacher']
  ];
  dictRows.forEach(r => sheetDict.appendRow(r));
  sheetDict.getRange('A1:E1').setBackground('#082B5F').setFontColor('#FFFFFF').setFontWeight('bold');
  sheetDict.getRange('A4:E4').setBackground('#1677E8').setFontColor('#FFFFFF').setFontWeight('bold');

  Logger.log('Semua sheet berhasil dibuat dengan struktur resmi.');
}

// -----------------------------------------------------------------------------------------------
// 2. POPULATE SAMPLE DATA (Jalankan ini jika ingin mengisi 30 siswa demo)
// -----------------------------------------------------------------------------------------------
function populateSampleData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const studentSheet = ss.getSheetByName('Teacher_Student_Input');
  const readingSheet = ss.getSheetByName('Reading_Data_Input');
  
  if (!studentSheet || !readingSheet) {
    setupSheetsAndFormulas();
  }

  const sampleStudents = [
    { id: 'EXP-5001', name: 'Aisyah Putri', score: 88, main: 90, spec: 87, inf: 85, voc: 70, eng: 4.0, conf: 4.2, anx: 2.1, mot: 4.5 },
    { id: 'EXP-5002', name: 'Bima Santoso', score: 82, main: 85, spec: 78, inf: 72, voc: 68, eng: 3.8, conf: 4.0, anx: 2.8, mot: 3.9 },
    { id: 'EXP-5003', name: 'Citra Lestari', score: 76, main: 80, spec: 72, inf: 68, voc: 65, eng: 3.5, conf: 3.7, anx: 3.5, mot: 3.8 },
    { id: 'EXP-5004', name: 'Daffa Pratama', score: 69, main: 72, spec: 65, inf: 60, voc: 60, eng: 3.2, conf: 3.3, anx: 4.0, mot: 3.2 },
    { id: 'EXP-5005', name: 'Eka Rahma', score: 91, main: 88, spec: 87, inf: 82, voc: 75, eng: 4.3, conf: 4.5, anx: 1.8, mot: 4.7 },
    { id: 'EXP-5006', name: 'Fajar Nugroho', score: 73, main: 76, spec: 70, inf: 65, voc: 64, eng: 3.4, conf: 3.6, anx: 3.2, mot: 3.5 },
    { id: 'EXP-5007', name: 'Gita Aprilia', score: 61, main: 65, spec: 60, inf: 55, voc: 54, eng: 3.0, conf: 3.1, anx: 4.2, mot: 3.1 },
    { id: 'EXP-5008', name: 'Hendra Wijaya', score: 85, main: 83, spec: 80, inf: 76, voc: 72, eng: 3.7, conf: 3.9, anx: 2.6, mot: 4.0 },
    { id: 'EXP-5009', name: 'Intan Safitri', score: 78, main: 75, spec: 70, inf: 66, voc: 68, eng: 3.3, conf: 3.5, anx: 3.4, mot: 3.6 },
    { id: 'EXP-5010', name: 'Julian Pratama', score: 72, main: 68, spec: 62, inf: 58, voc: 56, eng: 3.0, conf: 3.2, anx: 3.9, mot: 3.3 },
    { id: 'EXP-5011', name: 'Kirana Wulandari', score: 89, main: 92, spec: 90, inf: 84, voc: 78, eng: 4.4, conf: 4.3, anx: 1.9, mot: 4.6 },
    { id: 'EXP-5012', name: 'Lukman Hakim', score: 66, main: 70, spec: 64, inf: 58, voc: 55, eng: 3.1, conf: 3.0, anx: 3.8, mot: 3.2 },
    { id: 'EXP-5013', name: 'Maya Anggraini', score: 86, main: 88, spec: 85, inf: 79, voc: 73, eng: 4.1, conf: 4.0, anx: 2.2, mot: 4.3 },
    { id: 'EXP-5014', name: 'Naufal Rizky', score: 52, main: 54, spec: 50, inf: 48, voc: 46, eng: 2.6, conf: 2.5, anx: 4.6, mot: 2.8 },
    { id: 'EXP-5015', name: 'Olivia Salsabila', score: 94, main: 96, spec: 94, inf: 88, voc: 84, eng: 4.6, conf: 4.7, anx: 1.5, mot: 4.9 },
    { id: 'EXP-5016', name: 'Panji Gumilang', score: 79, main: 82, spec: 76, inf: 70, voc: 67, eng: 3.6, conf: 3.7, anx: 2.9, mot: 3.7 },
    { id: 'EXP-5017', name: 'Qonita Zahra', score: 87, main: 89, spec: 86, inf: 81, voc: 76, eng: 4.2, conf: 4.1, anx: 2.0, mot: 4.4 },
    { id: 'EXP-5018', name: 'Rian Hidayat', score: 71, main: 74, spec: 68, inf: 63, voc: 61, eng: 3.2, conf: 3.4, anx: 3.5, mot: 3.4 },
    { id: 'EXP-5019', name: 'Siti Nurhaliza', score: 88, main: 91, spec: 89, inf: 83, voc: 75, eng: 4.3, conf: 4.2, anx: 1.9, mot: 4.5 },
    { id: 'EXP-5020', name: 'Taufiq Rahman', score: 64, main: 66, spec: 61, inf: 56, voc: 52, eng: 3.0, conf: 2.9, anx: 4.1, mot: 3.0 },
    { id: 'EXP-5021', name: 'Utami Dewi', score: 84, main: 86, spec: 82, inf: 77, voc: 71, eng: 3.9, conf: 3.8, anx: 2.4, mot: 4.1 },
    { id: 'EXP-5022', name: 'Vino Bastian', score: 48, main: 50, spec: 46, inf: 42, voc: 40, eng: 2.4, conf: 2.2, anx: 4.8, mot: 2.6 },
    { id: 'EXP-5023', name: 'Wulan Guritno', score: 86, main: 88, spec: 84, inf: 80, voc: 74, eng: 4.0, conf: 4.1, anx: 2.1, mot: 4.2 },
    { id: 'EXP-5024', name: 'Xavier Pratama', score: 77, main: 79, spec: 75, inf: 69, voc: 66, eng: 3.5, conf: 3.6, anx: 3.0, mot: 3.7 },
    { id: 'EXP-5025', name: 'Yasmin Zahirah', score: 90, main: 93, spec: 91, inf: 85, voc: 79, eng: 4.5, conf: 4.4, anx: 1.7, mot: 4.7 },
    { id: 'EXP-5026', name: 'Zack Lee', score: 74, main: 76, spec: 71, inf: 66, voc: 63, eng: 3.4, conf: 3.5, anx: 3.3, mot: 3.5 },
    { id: 'EXP-5027', name: 'Aditya Pratama', score: 85, main: 87, spec: 83, inf: 78, voc: 72, eng: 3.8, conf: 3.9, anx: 2.3, mot: 4.0 },
    { id: 'EXP-5028', name: 'Bella Safira', score: 68, main: 71, spec: 65, inf: 59, voc: 56, eng: 3.1, conf: 3.2, anx: 3.7, mot: 3.3 },
    { id: 'EXP-5029', name: 'Chairul Tanjung', score: 81, main: 84, spec: 79, inf: 73, voc: 67, eng: 3.7, conf: 3.8, anx: 2.7, mot: 3.9 },
    { id: 'EXP-5030', name: 'Dina Lorenza', score: 87, main: 89, spec: 86, inf: 82, voc: 75, eng: 4.2, conf: 4.1, anx: 2.0, mot: 4.3 }
  ];

  // Insert students
  sampleStudents.forEach((s, idx) => {
    const d = '2026-09-' + String(10 + Math.floor(idx / 2)).padStart(2, '0');
    studentSheet.appendRow([s.id, d, s.name, 'SMP Negeri 1', 'VIII-A', 'Grade 8', 'Ms. Dewi', 'Yes']);
  });

  // Insert Session 5 records
  sampleStudents.forEach(s => {
    let level = 'Needs Support';
    if (s.score >= 85) level = 'Excellent';
    else if (s.score >= 70) level = 'Good';
    else if (s.score >= 55) level = 'Fair';

    readingSheet.appendRow([
      s.id, s.name, 'VIII-A', 'Session 5',
      'READ-05', 'The Importance of Renewable Energy', 'Expository', 'B1',
      s.score, s.main, s.spec, s.inf, s.voc,
      85, 120, s.eng, s.conf, s.anx, s.mot, level
    ]);
  });

  Logger.log('30 data siswa dan reading session berhasil ditambahkan.');
}

// -----------------------------------------------------------------------------------------------
// 3. WEB APP ENDPOINTS (doGet & doPost)
// -----------------------------------------------------------------------------------------------

/**
 * Endpoint GET: Mengirimkan seluruh data siswa & reading session ke dashboard dalam format JSON.
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Baca data siswa (Student_ID, Date, Student_Name, School, Class, Grade, Teacher_Name, Active)
    const studentSheet = ss.getSheetByName('Teacher_Student_Input');
    const students = [];
    if (studentSheet && studentSheet.getLastRow() > 4) {
      const rows = studentSheet.getRange(5, 1, studentSheet.getLastRow() - 4, 8).getValues();
      rows.forEach(r => {
        if (r[0]) {
          let dateStr = '';
          if (r[1] instanceof Date) {
            dateStr = Utilities.formatDate(r[1], Session.getScriptTimeZone(), 'yyyy-MM-dd');
          } else if (r[1]) {
            dateStr = String(r[1]);
          }
          students.push({
            id: String(r[0]),
            date: dateStr,
            name: String(r[2]),
            school: String(r[3]),
            class: String(r[4]),
            grade: String(r[5]),
            teacherName: String(r[6]),
            active: String(r[7]).toLowerCase() === 'yes' || r[7] === true || String(r[7]).toLowerCase() === 'true'
          });
        }
      });
    }

    // 2. Baca data sesi membaca
    const readingSheet = ss.getSheetByName('Reading_Data_Input');
    const sessions = [];
    if (readingSheet && readingSheet.getLastRow() > 4) {
      const rows = readingSheet.getRange(5, 1, readingSheet.getLastRow() - 4, 20).getValues();
      rows.forEach(r => {
        if (r[0]) {
          sessions.push({
            studentId: String(r[0]),
            studentName: String(r[1]),
            class: String(r[2]),
            session: String(r[3]),
            readingTextId: String(r[4]),
            readingTextTitle: String(r[5]),
            textType: String(r[6]),
            textLevel: String(r[7]),
            readingScore: Number(r[8]) || 0,
            mainIdeaScore: Number(r[9]) || 0,
            specificInformationScore: Number(r[10]) || 0,
            inferenceScore: Number(r[11]) || 0,
            vocabularyScore: Number(r[12]) || 0,
            taskCompletionPercent: Number(r[13]) || 0,
            responseTimeSeconds: Number(r[14]) || 0,
            engagement: Number(r[15]) || 0,
            confidence: Number(r[16]) || 0,
            readingAnxiety: Number(r[17]) || 0,
            motivation: Number(r[18]) || 0,
            performanceLevel: String(r[19]) || 'Good'
          });
        }
      });
    }

    // 3. Baca data wawasan & rekomendasi AI
    const aiSheet = ss.getSheetByName('AI_Insights_Input');
    const insights = [];
    if (aiSheet && aiSheet.getLastRow() > 4) {
      const rows = aiSheet.getRange(5, 1, aiSheet.getLastRow() - 4, 7).getValues();
      rows.forEach(r => {
        if (r[0]) {
          insights.push({
            studentId: String(r[0]),
            teacherObservation: String(r[1]),
            priority: String(r[2]) || 'Medium',
            aiInsight: String(r[3]),
            suggestedActions: r[4] ? String(r[4]).split('\\n') : [],
            teacherDecision: String(r[5]) || 'Pending',
            teacherComment: String(r[6])
          });
        }
      });
    }

    const payload = {
      status: 'success',
      timestamp: new Date().toISOString(),
      students: students,
      readingSessions: sessions,
      aiInsights: insights
    };

    return ContentService.createTextOutput(JSON.stringify(payload))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Endpoint POST: Menerima data baru dari dashboard (siswa baru, sesi membaca baru, keputusan guru).
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Aksi 1: Tambah Siswa Baru (Student_ID, Date, Student_Name, School, Class, Grade, Teacher_Name, Active)
    if (action === 'addStudent') {
      const s = postData.student;
      const sheet = ss.getSheetByName('Teacher_Student_Input');
      const d = s.date || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
      sheet.appendRow([s.id, d, s.name, s.school, s.class, s.grade, s.teacherName, s.active ? 'Yes' : 'No']);
    } 
    // Aksi 2: Tambah Data Sesi Membaca
    else if (action === 'addReadingSession') {
      const r = postData.session;
      const sheet = ss.getSheetByName('Reading_Data_Input');
      let perfLevel = 'Needs Support';
      if (r.readingScore >= 85) perfLevel = 'Excellent';
      else if (r.readingScore >= 70) perfLevel = 'Good';
      else if (r.readingScore >= 55) perfLevel = 'Fair';

      sheet.appendRow([
        r.studentId, r.studentName, r.class, r.session,
        r.readingTextId, r.readingTextTitle, r.textType, r.textLevel,
        r.readingScore, r.mainIdeaScore, r.specificInformationScore,
        r.inferenceScore, r.vocabularyScore, r.taskCompletionPercent,
        r.responseTimeSeconds, r.engagement, r.confidence,
        r.readingAnxiety, r.motivation, perfLevel
      ]);
    } 
    // Aksi 3: Simpan Keputusan Guru (Accept, Modify, Reject)
    else if (action === 'updateDecision') {
      const sheet = ss.getSheetByName('AI_Insights_Input');
      const data = sheet.getDataRange().getValues();
      let found = false;
      for (let i = 4; i < data.length; i++) {
        if (data[i][0] === postData.studentId) {
          sheet.getRange(i + 1, 6).setValue(postData.decision);
          if (postData.comment) sheet.getRange(i + 1, 7).setValue(postData.comment);
          found = true;
          break;
        }
      }
      if (!found) {
        sheet.appendRow([
          postData.studentId, '', 'Medium',
          postData.aiInsight || '', postData.suggestedAction || '',
          postData.decision, postData.comment || ''
        ]);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;
