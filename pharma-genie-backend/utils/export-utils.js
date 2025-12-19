/**
 * Export Utilities for CSV and Excel
 * Handles dynamic export of multi-collection data
 */

import ExcelJS from 'exceljs';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get headers for each collection type
 */
const getHeadersForCollection = (collectionType) => {
  const headers = {
    trials: [
      { id: 'trialId', title: 'Trial ID' },
      { id: 'title', title: 'Title' },
      { id: 'sponsor', title: 'Sponsor' },
      { id: 'drug', title: 'Drug' },
      { id: 'indication', title: 'Indication' },
      { id: 'phase', title: 'Phase' },
      { id: 'status', title: 'Status' },
      { id: 'startDate', title: 'Start Date' },
      { id: 'endDate', title: 'End Date' },
      { id: 'currentEnrollment', title: 'Current Enrollment' },
      { id: 'enrollmentTarget', title: 'Enrollment Target' },
      { id: 'enrollmentProgress', title: 'Progress' }
    ],
    drugs: [
      { id: 'drugId', title: 'Drug ID' },
      { id: 'name', title: 'Name' },
      { id: 'class', title: 'Class' },
      { id: 'approvalStatus', title: 'Approval Status' },
      { id: 'description', title: 'Description' },
      { id: 'mechanism', title: 'Mechanism of Action' }
    ],
    sites: [
      { id: 'siteId', title: 'Site ID' },
      { id: 'name', title: 'Name' },
      { id: 'city', title: 'City' },
      { id: 'state', title: 'State' },
      { id: 'country', title: 'Country' },
      { id: 'postalCode', title: 'Postal Code' },
      { id: 'capacity', title: 'Capacity' },
      { id: 'currentTrials', title: 'Current Trials' }
    ],
    participants: [
      { id: 'participantId', title: 'Participant ID' },
      { id: 'age', title: 'Age' },
      { id: 'gender', title: 'Gender' },
      { id: 'ethnicity', title: 'Ethnicity' },
      { id: 'enrollmentStatus', title: 'Enrollment Status' },
      { id: 'enrollmentDate', title: 'Enrollment Date' },
      { id: 'trialId', title: 'Trial ID' }
    ],
    adverseEvents: [
      { id: 'eventId', title: 'Event ID' },
      { id: 'severity', title: 'Severity' },
      { id: 'isSerious', title: 'Is Serious' },
      { id: 'description', title: 'Description' },
      { id: 'outcome', title: 'Outcome' },
      { id: 'reportDate', title: 'Report Date' },
      { id: 'participantId', title: 'Participant ID' },
      { id: 'trialId', title: 'Trial ID' }
    ]
  };

  return headers[collectionType] || [];
};

/**
 * Normalize data for export (handle nested objects)
 */
const normalizeDataForExport = (data, collectionType) => {
  return data.map(item => {
    const normalized = { ...item };
    
    // Handle nested approval status for drugs
    if (collectionType === 'drugs' && typeof normalized.approvalStatus === 'object') {
      normalized.approvalStatus = normalized.approvalStatus?.status || 
                                  normalized.approvalStatus?.FDA ? 'FDA Approved' : 'Unknown';
    }
    
    // Handle boolean values
    if (normalized.isSerious !== undefined) {
      normalized.isSerious = normalized.isSerious ? 'Yes' : 'No';
    }
    
    return normalized;
  });
};

/**
 * Export data to CSV
 */
export async function exportToCSV(data, collectionType, exportPath) {
  const headers = getHeadersForCollection(collectionType);
  const normalizedData = normalizeDataForExport(data, collectionType);
  
  const csvWriter = createObjectCsvWriter({
    path: exportPath,
    header: headers
  });

  await csvWriter.writeRecords(normalizedData);
  return exportPath;
}

/**
 * Export data to Excel
 */
export async function exportToExcel(data, collectionType, exportPath) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(collectionType.charAt(0).toUpperCase() + collectionType.slice(1));
  
  const headers = getHeadersForCollection(collectionType);
  const normalizedData = normalizeDataForExport(data, collectionType);
  
  // Set columns
  worksheet.columns = headers.map(h => ({
    header: h.title,
    key: h.id,
    width: h.title.length < 15 ? 15 : h.title.length + 5
  }));

  // Style header row
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4A90E2' }
  };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // Add data rows
  normalizedData.forEach(record => {
    worksheet.addRow(record);
  });

  // Auto-filter
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: headers.length }
  };

  await workbook.xlsx.writeFile(exportPath);
  return exportPath;
}

/**
 * Export multi-collection data to Excel with multiple sheets
 */
export async function exportMultiCollectionToExcel(responseData, exportPath) {
  const workbook = new ExcelJS.Workbook();
  
  // Summary sheet
  const summarySheet = workbook.addWorksheet('Summary');
  summarySheet.columns = [
    { header: 'Collection', key: 'collection', width: 20 },
    { header: 'Count', key: 'count', width: 15 }
  ];
  
  summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  summarySheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4A90E2' }
  };

  const collections = ['trials', 'drugs', 'sites', 'participants', 'adverseEvents'];
  collections.forEach(col => {
    if (responseData[col] && responseData[col].length > 0) {
      summarySheet.addRow({
        collection: col.charAt(0).toUpperCase() + col.slice(1),
        count: responseData[col].length
      });
      
      // Create sheet for each collection
      const sheet = workbook.addWorksheet(col.charAt(0).toUpperCase() + col.slice(1));
      const headers = getHeadersForCollection(col);
      const normalizedData = normalizeDataForExport(responseData[col], col);
      
      sheet.columns = headers.map(h => ({
        header: h.title,
        key: h.id,
        width: h.title.length < 15 ? 15 : h.title.length + 5
      }));

      sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4A90E2' }
      };

      normalizedData.forEach(record => {
        sheet.addRow(record);
      });

      sheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: headers.length }
      };
    }
  });

  await workbook.xlsx.writeFile(exportPath);
  return exportPath;
}

/**
 * Determine if data is from a single collection or multiple
 */
export function getSingleCollectionType(responseData) {
  const collections = ['trials', 'drugs', 'sites', 'participants', 'adverseEvents'];
  let nonEmptyCollections = [];
  
  collections.forEach(col => {
    if (responseData[col] && responseData[col].length > 0) {
      nonEmptyCollections.push(col);
    }
  });
  
  return nonEmptyCollections.length === 1 ? nonEmptyCollections[0] : null;
}
