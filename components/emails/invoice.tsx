'use client';

import { cn } from '@/lib/utils';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  senderName: string;
  senderEmail: string;
  senderAddress?: string;
  recipientName: string;
  recipientEmail: string;
  recipientAddress: string;
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
}

interface EmailInvoiceProps {
  data: InvoiceData;
  logoUrl?: string;
  className?: string;
}

const createStyle = (styles: Record<string, string>): React.CSSProperties => ({
  ...styles,
});

export default function EmailInvoice({
  data,
  logoUrl,
  className,
}: EmailInvoiceProps) {
  const accentColor = '#7c3aed';
  
  const styles = createStyle({
    body: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      margin: '0',
      padding: '0',
      backgroundColor: '#f8fafc',
      color: '#1e293b',
      lineHeight: '1.6',
    },
    container: {
      maxWidth: '640px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
    },
    header: {
      padding: '40px 32px',
      backgroundColor: '#ffffff',
      borderBottom: `1px solid ${createStyle({ border: 'rgba(0,0,0,0.08)' })}`,
    },
    logo: {
      maxWidth: '160px',
      height: 'auto',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '8px',
      letterSpacing: '-0.5px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#64748b',
      marginBottom: '0',
    },
    infoSection: {
      padding: '32px 32px 0',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
    },
    infoBlock: {
      fontSize: '13px',
      color: '#64748b',
    },
    label: {
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontSize: '11px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '32px',
    },
    th: {
      textAlign: 'left',
      padding: '16px 24px',
      backgroundColor: '#f8fafc',
      borderBottom: `1px solid ${createStyle({ border: 'rgba(0,0,0,0.08)' })}`,
      fontSize: '12px',
      fontWeight: '600',
      color: '#475569',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    td: {
      padding: '16px 24px',
      borderBottom: `1px solid ${createStyle({ border: 'rgba(0,0,0,0.08)' })}`,
      fontSize: '14px',
      color: '#1e293b',
    },
    amountCell: {
      textAlign: 'right',
    },
    totalsSection: {
      padding: '32px 32px 40px',
      backgroundColor: '#f8fafc',
      marginTop: 'auto',
      borderRadius: '0 0 8px 8px',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 0',
      fontSize: '14px',
      color: '#64748b',
    },
    grandTotal: {
      borderTop: `1px solid ${createStyle({ border: 'rgba(0,0,0,0.08)' })}`,
      paddingTop: '20px',
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
    },
    footer: {
      padding: '40px 32px',
      backgroundColor: '#ffffff',
      borderTop: `1px solid ${createStyle({ border: 'rgba(0,0,0,0.08)' })}`,
    },
    notes: {
      fontSize: '13px',
      color: '#64748b',
      marginBottom: '24px',
    },
    terms: {
      fontSize: '12px',
      color: '#94a3b8',
      marginTop: 'auto',
      borderTop: `1px solid ${createStyle({ border: 'rgba(0,0,0,0.08)' })}`,
      paddingTop: '24px',
    },
    accentButton: {
      display: 'inline-block',
      padding: '12px 24px',
      backgroundColor: accentColor,
      color: '#ffffff',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '600',
      textDecoration: 'none',
    },
  });

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt={`${data.senderName} logo`} 
              style={styles.logo} 
            />
          )}
          {!logoUrl && (
            <div style={{ ...styles.title, color: accentColor }}>
              {data.senderName || 'Syntheon'}
            </div>
          )}
          <p style={styles.subtitle}>
            Invoice #{data.invoiceNumber}
          </p>
        </header>

        {/* Info Sections */}
        <section style={styles.infoSection}>
          <div style={{ ...styles.infoBlock, marginBottom: '0' }}>
            <span style={styles.label}>From</span>
            {data.senderAddress ? (
              <>
                {data.senderName}<br />
                {data.senderAddress}
              </>
            ) : (
              data.senderEmail
            )}
          </div>

          <div style={{ ...styles.infoBlock, marginBottom: '0' }}>
            <span style={styles.label}>Bill To</span>
            {data.recipientAddress ? (
              <>
                {data.recipientName}<br />
                {data.recipientAddress}
              </>
            ) : (
              data.recipientEmail
            )}
          </div>

          <div style={{ ...styles.infoBlock, marginBottom: '0' }}>
            <span style={styles.label}>Invoice Date</span>
            {new Date(data.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>

          <div style={{ ...styles.infoBlock, marginBottom: '0' }}>
            <span style={styles.label}>Due Date</span>
            {new Date(data.dueDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </section>

        {/* Items Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Description</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Qty</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Unit Price</th>
              <th style={{ ...styles.th, textAlign: 'right', fontWeight: '700' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index}>
                <td style={styles.td}>{item.description}</td>
                <td style={{ ...styles.td, textAlign: 'right' }}>{item.quantity}</td>
                <td style={{ ...styles.td, textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                <td style={{ ...styles.td, ...styles.amountCell, fontWeight: '600' }}>
                  {formatCurrency(item.quantity * item.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <section style={styles.totalsSection}>
          <div style={{ ...styles.totalRow, fontWeight: '600', color: '#1e293b' }}>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div style={styles.grandTotal}>
            <strong>Total Due: {formatCurrency(subtotal)}</strong>
          </div>
        </section>

        {/* Footer */}
        <footer style={styles.footer}>
          {data.notes && (
            <p style={styles.notes}>{data.notes}</p>
          )}
          
          {data.terms && (
            <p style={styles.terms}>{data.terms}</p>
          )}

          <div style={{ ...styles.accentButton, textAlign: 'center' }}>
            Pay Invoice Online
          </div>
        </footer>
      </div>
    </div>
  );
}
