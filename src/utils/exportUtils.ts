import { StopObservation } from '../types';

export function exportToCSV(observations: StopObservation[], filename = 'تقرير-ملاحظات-STOP-HSE.csv') {
  const headers = [
    'رقم البطاقة',
    'التاريخ',
    'الوقت',
    'المحطة / المنشأة',
    'الموقع الدقيق',
    'المعدة / الأصل',
    'نوع الملاحظة',
    'التصنيف الفني',
    'مستوى الخطورة',
    'درجة الخطر (1-100)',
    'الراصد',
    'الوصف',
    'الإجراء الفوري',
    'الإجراء الوقائي',
    'السبب الجذري',
    'جهة التوجيه الآلي',
    'الحالة'
  ];

  const rows = observations.map((o) => [
    `"${o.ticketNumber}"`,
    `"${o.date}"`,
    `"${o.time}"`,
    `"${o.stationName}"`,
    `"${o.locationDetails}"`,
    `"${o.assetName || 'غير محدد'}"`,
    `"${o.type}"`,
    `"${o.category}"`,
    `"${o.severity === 'high' ? 'حرج' : o.severity === 'medium' ? 'متوسط' : 'منخفض'}"`,
    o.riskScore,
    `"${o.observerName}"`,
    `"${(o.description || '').replace(/"/g, '""')}"`,
    `"${(o.immediateAction || '').replace(/"/g, '""')}"`,
    `"${(o.preventiveAction || '').replace(/"/g, '""')}"`,
    `"${(o.rootCause || '').replace(/"/g, '""')}"`,
    `"${o.assignedTo}"`,
    `"${o.status}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printExecutiveReport() {
  window.print();
}
