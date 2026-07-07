import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, renderToStream } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  leftColumn: {
    width: '35%',
    backgroundColor: '#1e293b', // slate-800
    color: '#ffffff',
    padding: 30,
  },
  rightColumn: {
    width: '65%',
    padding: 40,
    backgroundColor: '#f8fafc', // slate-50
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    alignSelf: 'center',
    objectFit: 'cover',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1e40af', // blue-800
  },
  jobTitle: {
    fontSize: 14,
    color: '#64748b', // slate-500
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  sectionTitleLeft: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#475569',
    paddingBottom: 5,
  },
  sectionTitleRight: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0f172a', // slate-900
    borderBottomWidth: 2,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 5,
  },
  textLight: {
    fontSize: 10,
    marginBottom: 8,
    color: '#cbd5e1',
  },
  textDark: {
    fontSize: 11,
    marginBottom: 8,
    color: '#334155',
    lineHeight: 1.5,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: 100,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
  },
  value: {
    flex: 1,
    fontSize: 10,
    color: '#334155',
  }
});

interface CandidateData {
  firstName: string;
  surname: string;
  fatherName: string;
  motherName: string;
  dob: string;
  address: string;
  passportNo: string;
  mobile: string;
  email: string;
  jobAppliedFor: string;
  countryAppliedFor: string;
  photoUrl: string; // Base64 or URL
}

// Create Document Component
const CVTemplate = ({ data }: { data: CandidateData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Left Column - Sidebar */}
      <View style={styles.leftColumn}>
        {data.photoUrl ? (
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={data.photoUrl} style={styles.photo} />
        ) : (
          <View style={{...styles.photo, backgroundColor: '#cbd5e1'}} />
        )}
        
        <Text style={styles.sectionTitleLeft}>Contact Info</Text>
        <Text style={styles.textLight}>{data.mobile}</Text>
        <Text style={styles.textLight}>{data.email}</Text>
        <Text style={{...styles.textLight, marginTop: 10}}>{data.address}</Text>

        <Text style={styles.sectionTitleLeft}>Target Location</Text>
        <Text style={styles.textLight}>{data.countryAppliedFor.toUpperCase()}</Text>
      </View>

      {/* Right Column - Main Content */}
      <View style={styles.rightColumn}>
        <Text style={styles.name}>{data.firstName} {data.surname}</Text>
        <Text style={styles.jobTitle}>{data.jobAppliedFor.replace('_', ' ')}</Text>
        
        <Text style={styles.sectionTitleRight}>Personal Information</Text>
        
        <View style={styles.labelRow}>
          <Text style={styles.label}>{"Father's Name:"}</Text>
          <Text style={styles.value}>{data.fatherName}</Text>
        </View>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{"Mother's Name:"}</Text>
          <Text style={styles.value}>{data.motherName}</Text>
        </View>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>{data.dob}</Text>
        </View>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Passport No:</Text>
          <Text style={styles.value}>{data.passportNo.toUpperCase()}</Text>
        </View>

        <Text style={{...styles.sectionTitleRight, marginTop: 20}}>Professional Summary</Text>
        <Text style={styles.textDark}>
          Dedicated and highly motivated {data.jobAppliedFor.replace('_', ' ')} seeking opportunities in {data.countryAppliedFor.toUpperCase()}. 
          Equipped with a strong work ethic, adaptability to new environments, and a commitment to maintaining the highest professional standards.
          Ready to contribute effectively to your organization.
        </Text>

      </View>
    </Page>
  </Document>
);

/**
 * Generates a CV PDF stream from candidate data
 * Can be used in Next.js API Routes to return the PDF
 */
export const generateCVStream = async (data: CandidateData) => {
  return await renderToStream(<CVTemplate data={data} />);
};
