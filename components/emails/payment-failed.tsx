'use client';

import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

interface PaymentFailedProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  amount?: string;
  retryUrl?: string;
  supportEmail?: string;
  logo?: ReactNode;
}

const baseStyles = {
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(124, 58, 237, 0.15)',
  },
  header: {
    padding: '24px 24px 16px',
    textAlign: 'center',
    backgroundColor: '#faf5ff',
    borderBottom: `1px solid ${'rgba(124, 58, 237, 0.2)'}`,
  },
  icon: {
    width: '48px',
    height: '48px',
    margin: '0 auto 12px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(124, 58, 237, 0.2)',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#4c1d95',
    margin: '0 0 8px',
  },
  body: {
    padding: '24px 32px',
    lineHeight: 1.7,
    fontSize: '16px',
    color: '#3730a3',
  },
  amount: {
    fontSize: '18px',
    fontWeight: 500,
    padding: '8px 12px',
    backgroundColor: '#f3e8ff',
    borderRadius: '6px',
    display: 'inline-block',
    marginBottom: '16px',
  },
  message: {
    fontSize: '15px',
    color: '#4c1d95',
    margin: '0 0 20px',
  },
  actionContainer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '24px',
  },
  button: (variant: 'primary' | 'secondary') => ({
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: 600,
    borderRadius: '8px',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
    transition: 'all 0.2s ease',
  }),
  primaryButton: {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
  },
  secondaryButton: {
    backgroundColor: '#f3e8ff',
    color: '#4c1d95',
    border: `1px solid ${'rgba(124, 58, 237, 0.2)'}`,
  },
  footer: {
    padding: '16px 32px',
    backgroundColor: '#faf5ff',
    textAlign: 'center',
    fontSize: '13px',
    color: '#4c1d95',
    borderTop: `1px solid ${'rgba(124, 58, 237, 0.1)'}`,
  },
};

const getDarkModeStyles = () => ({
  container: { ...baseStyles.container, backgroundColor: '#1a103c', boxShadow: 'none' },
  header: { ...baseStyles.header, backgroundColor: '#2d1f4d', borderBottomColor: 'rgba(124, 58, 237, 0.3)' },
  icon: { ...baseStyles.icon, backgroundColor: '#2d1f4d' },
  title: { ...baseStyles.title, color: '#c4b5fd' },
  body: { ...baseStyles.body, color: '#e9d5ff', backgroundColor: '#1a103c' },
  amount: { ...baseStyles.amount, backgroundColor: '#2d1f4d', color: '#e9d5ff' },
  message: { ...baseStyles.message, color: '#c4b5fd' },
  primaryButton: { ...baseStyles.primaryButton, boxShadow: '0 4px 16px rgba(124, 58, 237, 0.4)' },
  secondaryButton: { ...baseStyles.secondaryButton, backgroundColor: '#2d1f4d', color: '#e9d5ff' },
  footer: { ...baseStyles.footer, backgroundColor: '#2d1f4d', borderTopColor: 'rgba(124, 58, 237, 0.2)' },
});

const buildStyleString = (styles: Record<string, any>) => {
  const result: string[] = [];
  for (const [key, value] of Object.entries(styles)) {
    if (typeof value === 'object') {
      result.push(`${key}: ${JSON.stringify(value)}`);
    } else {
      result.push(`${key}: ${value}`);
    }
  }
  return `{${result.join(';')}}`;
};

const createInlineStyle = (styles: Record<string, any>) => {
  const styleString = buildStyleString(styles);
  return `<style>${styleString}</style>`;
};

export default function PaymentFailed({ title, message, amount, retryUrl, supportEmail, logo, className }: PaymentFailedProps) {
  const darkModeStyles = getDarkModeStyles();
  
  const createElement = (tag: string, props: Record<string, any>, children?: ReactNode) => {
    let styleAttr = '';
    if (props.style) {
      styleAttr = ` style="${JSON.stringify(props.style)}"`;
    }
    
    return `<${tag}${styleAttr} class="${props.className || ''}">${children}</${tag}>`;
  };

  const createButton = (text: string, url?: string, variant: 'primary' | 'secondary' = 'primary') => {
    if (!url) {
      // If no URL, assume it's a clickable element within email
      return createElement('span', { style: baseStyles.button(variant), className: 'cursor-pointer' }, text);
    }
    
    const hrefStyle = url ? `href="${url}"` : '';
    return createElement(
      'a',
      { 
        style: baseStyles.button(variant), 
        className: 'text-decoration-none',
        ...hrefStyle,
      },
      text
    );
  };

  const createAmount = (amount?: string) => {
    if (!amount) return null;
    
    return createElement(
      'div',
      { style: baseStyles.amount },
      `Total amount: ${amount}`
    );
  };

  const createHeader = () => {
    const iconContent = logo ? (typeof logo === 'string' ? `<img src="${logo}" alt="" style="width:24px;height:24px;object-fit:contain;">` : logo) : '';
    
    return createElement(
      'div',
      { style: baseStyles.header },
      createElement('div', {}, iconContent),
      createElement('h1', { style: baseStyles.title, className: 'margin-0' }, title || 'Payment Failed'),
      createElement('p', { style: { fontSize: '14px', color: '#6b7280', margin: 0 } }, 'We received your payment attempt but encountered an issue.')
    );
  };

  const createBody = () => {
    return createElement(
      'div',
      { style: baseStyles.body, className: 'space-y-4' },
      
      createAmount(amount),
      
      createElement('p', { style: baseStyles.message }, message || 'Your payment of the specified amount did not process successfully. This could be due to insufficient funds, a declined card, or a temporary network issue.'),
      
      createElement(
        'div',
        { style: { fontSize: '14px', color: '#6b7280' }, className: 'text-center italic' },
        'Common causes include:'
      ),
      
      createElement('ul', {}, 
        createElement('li', {}, 'Insufficient funds'),
        createElement('li', {}, 'Card declined by bank'),
        createElement('li', {}, 'Temporary network issue')
      ),
      
      createElement(
        'div',
        { style: baseStyles.actionContainer },
        createButton(title === 'Payment Failed' ? 'Retry Payment' : 'Try Again', retryUrl, 'primary'),
        createButton(supportEmail ? `Contact Support` : 'Need Help?', supportEmail, 'secondary')
      )
    );
  };

  const createFooter = () => {
    return createElement(
      'div',
      { style: baseStyles.footer },
      createElement('p', {}, 'Thank you for your patience.'),
      createElement('p', { style: { fontSize: '12px' } }, supportEmail ? `Questions? Reply to ${supportEmail}` : 'Questions? Reply to our support team.')
    );
  };

  const rootStyle = darkModeStyles.container;
  
  return createElement(
    'div',
    { 
      style: rootStyle, 
      className: cn('max-w-full mx-auto my-0'),
      role: 'alert' as any,
      aria: { label: title || 'Payment Failed Alert' } as any,
    },
    
    createElement(
      'table',
      {},
      
      createElement('tr', {}, 
        createElement('td', { style: { width: '100%', padding: 0, verticalAlign: 'middle' } }, 
          createElement(
            'div',
            { className: 'max-w-[600px] mx-auto my-0' },
            
            createHeader(),
            createBody(),
            createFooter()
            
          )
        )
      )
    ),
    
    createElement('style', {}, `
      @media screen and (max-width: 480px) {
        .mobile-padding { padding-left: 16px !important; padding-right: 16px !important; }
        .mobile-font-size { font-size: 15px !important; }
        .mobile-title { font-size: 18px !important; }
      }
    `)
  );
}

export type PaymentFailedComponent = typeof PaymentFailed;
