import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { motion, useReducedMotion } from 'framer-motion';
import { DataTablePro } from '@/components/premium-features/data-table-pro';

describe('DataTablePro', () => {
  const mockData = [
    { id: 1, name: 'Item A', status: 'active' },
    { id: 2, name: 'Item B', status: 'pending' },
    { id: 3, name: 'Item C', status: 'inactive' },
  ];

  const mockProps = {
    data: mockData,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'status', label: 'Status' },
    ],
    onSort: vi.fn(),
    onFilterChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default props and shows all data rows', () => {
    const { container } = render(<DataTablePro {...mockProps} />);
    
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.getByText('Item B')).toBeInTheDocument();
    expect(screen.getByText('Item C')).toBeInTheDocument();
  });

  it('applies correct base styles with Tailwind classes', () => {
    const wrapper = render(<DataTablePro {...mockProps} />);
    
    // Check for expected style tokens
    const container = wrapper.container;
    expect(container).toHaveStyle(/bg-background/);
    expect(container).toHaveStyle(/text-foreground/);
  });

  it('handles sorting with callback', async () => {
    render(<DataTablePro {...mockProps} />);
    
    // Find and click sort header
    const sortHeader = screen.getByRole('columnheader', { name: 'Name' });
    await userEvent.click(sortHeader);
    
    expect(mockProps.onSort).toHaveBeenCalled();
  });

  it('handles filtering with callback', async () => {
    render(<DataTablePro {...mockProps} />);
    
    // Find and type in filter input
    const filterInput = screen.getByRole('searchbox');
    await userEvent.type(filterInput, 'A');
    
    expect(mockProps.onFilterChange).toHaveBeenCalled();
  });

  it('displays loading state when data is null/undefined', () => {
    render(<DataTablePro data={null} columns={mockProps.columns} />);
    
    const loadingText = screen.getByText(/loading/i);
    expect(loadingText).toBeInTheDocument();
  });

  it('displays empty state when no results found', () => {
    const emptyData: any[] = [];
    render(<DataTablePro data={emptyData} columns={mockProps.columns} />);
    
    const emptyText = screen.getByText(/no results/i);
    expect(emptyText).toBeInTheDocument();
  });

  it('displays error state when error occurs', () => {
    render(<DataTablePro data={null} columns={mockProps.columns} error="Connection failed" />);
    
    const errorText = screen.getByText('Connection failed');
    expect(errorText).toBeInTheDocument();
  });

  it('applies reduced motion for users who prefer it', () => {
    // Simulate prefers-reduced-motion media query
    document.body.style.setProperty(
      'media-queries',
      '(prefers-reduced-motion: reduce)'
    );
    
    render(<DataTablePro {...mockProps} />);
    
    const container = wrapper.container;
    expect(container).toHaveStyle(/transition-duration/);
  });

  it('handles pagination controls', () => {
    // Pagination is typically enabled via props
    render(
      <DataTablePro 
        {...mockProps} 
        pageSize={2}
        totalRows={10}
      />
    );
    
    const pageControls = screen.queryByRole('navigation');
    expect(pageControls).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    render(<DataTablePro {...mockProps} />);
    
    // Tab through elements
    await userEvent.tab();
    
    // Focus should be on interactive elements
    const focusedElement = document.activeElement;
    expect(focusedElement).toHaveFocus();
  });

  it('renders with proper ARIA attributes', () => {
    render(<DataTablePro {...mockProps} />);
    
    // Check for accessibility features
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    const headers = screen.getAllByRole('columnheader');
    expect(headers.length).toBeGreaterThan(0);
  });

  it('handles hover states with smooth transitions', () => {
    render(<DataTablePro {...mockProps} />);
    
    // Hover over a row (if implemented)
    const rows = screen.getAllByRole('row');
    rows.forEach(row => {
      expect(row).toHaveStyle(/hover/);
    });
  });

  it('preserves layout transitions during data changes', async () => {
    render(<DataTablePro {...mockProps} />);
    
    // Simulate data change
    const newMockData = [...mockData, { id: 4, name: 'Item D', status: 'active' }];
    await waitFor(() => {
      expect(screen.getByText('Item D')).toBeInTheDocument();
    });
  });

  it('handles selection mode if enabled', () => {
    render(
      <DataTablePro 
        {...mockProps} 
        selectedIds={[1]}
        onSelectionChange={vi.fn()}
      />
    );
    
    const selectedRow = screen.getByText('Item A');
    expect(selectedRow).toHaveStyle(/selected/);
  });

  it('renders responsive design tokens correctly', () => {
    render(<DataTablePro {...mockProps} />);
    
    // Check for responsive utilities
    const container = wrapper.container;
    expect(container).toHaveStyle(/rounded-lg/);
    expect(container).toHaveStyle(/border-border/);
  });

  it('handles batch actions if provided', () => {
    render(
      <DataTablePro 
        {...mockProps} 
        selectedIds={[1, 2]}
        onBatchAction={vi.fn()}
      />
    );
    
    const batchButton = screen.queryByRole('button');
    expect(batchButton).toBeInTheDocument();
  });

  it('applies correct semantic color tokens', () => {
    render(<DataTablePro {...mockProps} />);
    
    // Verify semantic colors are applied
    const container = wrapper.container;
    expect(container).toHaveStyle(/bg-muted/);
    expect(container).toHaveStyle(/text-primary/);
  });

  it('handles infinite scroll if enabled', async () => {
    render(
      <DataTablePro 
        {...mockProps} 
        enableInfiniteScroll={true}
        onReachEnd={vi.fn()}
      />
    );
    
    // Scroll to bottom (simulated)
    const container = wrapper.container;
    expect(container).toHaveStyle(/overflow/);
  });

  it('preserves focus state during interactions', async () => {
    render(<DataTablePro {...mockProps} />);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    // Focus should be managed properly
    expect(document.activeElement).toBeInTheDocument();
  });

  it('handles dark mode correctly', () => {
    document.body.classList.add('dark');
    
    render(<DataTablePro {...mockProps} />);
    
    const container = wrapper.container;
    expect(container).toHaveStyle(/dark/);
  });

  it('renders with proper type safety (no TypeScript errors)', () => {
    // This test ensures the component accepts typed props
    const typedData: Array<{ id: number; name: string }> = mockData;
    
    render(<DataTablePro data={typedData} columns={mockProps.columns} />);
    
    expect(screen.getByText('Item A')).toBeInTheDocument();
  });

  it('handles edge case: very large dataset', async () => {
    const largeData = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      status: 'active' as const,
    }));
    
    render(<DataTablePro data={largeData} columns={mockProps.columns} />);
    
    // Should still render without crashing
    expect(screen.getByText('Item 0')).toBeInTheDocument();
  });

  it('handles edge case: empty column definitions', () => {
    render(
      <DataTablePro 
        data={mockData} 
        columns=[] 
        onSort={vi.fn()}
      />
    );
    
    // Should show error or default state
    const container = wrapper.container;
    expect(container).toBeInTheDocument();
  });

  it('handles edge case: null/undefined callbacks', () => {
    render(
      <DataTablePro 
        {...mockProps} 
        onSort={null as any}
        onFilterChange={undefined as any}
      />
    );
    
    // Should not crash
    expect(screen.getByText('Item A')).toBeInTheDocument();
  });

  it('handles edge case: special characters in data', () => {
    const specialData = [
      { id: 1, name: 'Item &quot;Test&quot;', status: 'active' },
    ];
    
    render(<DataTablePro data={specialData} columns={mockProps.columns} />);
    
    expect(screen.getByText('Item "Test"')).toBeInTheDocument();
  });

  it('handles edge case: very long text content', () => {
    const longText = 'A'.repeat(200);
    render(
      <DataTablePro 
        data={[{ id: 1, name: longText }]} 
        columns={mockProps.columns}
      />
    );
    
    // Should truncate or handle gracefully
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it('handles edge case: mixed status types', () => {
    const mixedData = [
      { id: 1, name: 'Item A', status: 'active' },
      { id: 2, name: 'Item B', status: 'pending' },
      { id: 3, name: 'Item C', status: 'error' },
    ];
    
    render(<DataTablePro data={mixedData} columns={mockProps.columns} />);
    
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('error')).toBeInTheDocument();
  });

  it('handles edge case: numeric IDs only', () => {
    const numericData = [
      { id: 100, name: 'Item A' },
      { id: 200, name: 'Item B' },
    ];
    
    render(<DataTablePro data={numericData} columns={mockProps.columns} />);
    
    expect(screen.getByText('Item A')).toBeInTheDocument();
  });

  it('handles edge case: boolean status values', () => {
    const boolData = [
      { id: 1, name: 'Item A', active: true },
      { id: 2, name: 'Item B', active: false },
    ];
    
    render(<DataTablePro data={boolData} columns={mockProps.columns} />);
    
    expect(screen.getByText('true')).toBeInTheDocument();
    expect(screen.getByText('false')).toBeInTheDocument();
  });

  it('handles edge case: date values in data', () => {
    const dateData = [
      { id: 1, name: 'Item A', createdAt: new Date() },
    ];
    
    render(<DataTablePro data={dateData} columns={mockProps.columns} />);
    
    expect(screen.getByText('Item A')).toBeInTheDocument();
  });

  it('handles edge case: very small dataset (single row)', () => {
    const singleRow = [{ id: 1, name: 'Only Item' }];
    
    render(<DataTablePro data={singleRow} columns={mockProps.columns} />);
    
    expect(screen.getByText('Only Item')).toBeInTheDocument();
  });

  it('handles edge case: very large dataset (10k+ rows)', async () => {
    const largeDataset = Array.from({ length: 15000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      status: 'active' as const,
    }));
    
    render(
      <DataTablePro 
        data={largeDataset} 
        columns={mockProps.columns}
        pageSize={100}
      />
    );
    
    // Should handle pagination correctly
    expect(screen.getByText('Item 0')).toBeInTheDocument();
  });

  it('handles edge case: special CSS characters in labels', () => {
    const specialColumns = [
      { key: 'name', label: 'Name & More' },
      { key: 'status', label: 'Status (Active)' },
    ];
    
    render(<DataTablePro data={mockData} columns={specialColumns} />);
    
    expect(screen.getByText('Name & More')).toBeInTheDocument();
  });

  it('handles edge case: emoji in data', () => {
    const emojiData = [
      { id: 1, name: 'Item 🎉' },
    ];
    
    render(<DataTablePro data={emojiData} columns={mockProps.columns} />);
    
    expect(screen.getByText('Item 🎉')).toBeInTheDocument();
  });

  it('handles edge case: unicode characters', () => {
    const unicodeData = [
      { id: 1, name: 'Привет' },
      { id: 2, name: 'こんにちは' },
    ];
    
    render(<DataTablePro data={unicodeData} columns={mockProps.columns} />);
    
    expect(screen.getByText('Привет')).toBeInTheDocument();
  });

  it('handles edge case: very long labels', () => {
    const longLabel = 'A'.repeat(100) + ' Label';
    render(
      <DataTablePro 
        data={mockData} 
        columns={[{ key: 'name', label: longLabel }]}
      />
    );
    
    // Should handle gracefully with truncation or wrapping
    expect(screen.getByText(longLabel)).toBeInTheDocument();
  });

  it('handles edge case: very short labels (single character)', () => {
    render(
      <DataTablePro 
        data={mockData} 
        columns={[{ key: 'name', label: 'N' }]}
      />
    );
    
    expect(screen.getByText('N')).toBeInTheDocument();
  });

  it('handles edge case: empty string labels', () => {
    render(
      <DataTablePro 
        data={mockData} 
        columns={[{ key: 'name', label: '' }]}
      />
    );
    
    // Should handle gracefully
    expect(screen.getByText('Item A')).toBeInTheDocument();
  });

  it('handles edge case: null/undefined in data array', () => {
    const mixedData = [
      { id: 1, name: 'Valid Item' },
      null as any, // Simulate null entry
      { id: 3, name: 'Another Valid Item' },
    ];
    
    render(<DataTablePro data={mixedData} columns={mockProps.columns} />);
    
    expect(screen.getByText('Valid Item')).toBeInTheDocument();
  });

  it('handles edge case: duplicate IDs', () => {
    const duplicateIdData = [
      { id: 1, name: 'First' },
      { id: 1, name: 'Second' }, // Duplicate ID
    ];
    
    render(<DataTablePro data={duplicateIdData} columns={mockProps.columns} />);
    
    expect(screen.getByText('First')).toBeInTheDocument();
  });

  it('handles edge case: very deep nesting in objects', () => {
    const nestedData = [
      { id: 1, name: 'Item A', metadata: { level1: { level2: { value: 'deep' } } } },
    ];
    
    render(<DataTablePro data={nestedData} columns={mockProps.columns} />);
    
    expect(screen.getByText('Item A')).toBeInTheDocument();
  });

  it('handles edge case: circular references (if any)', () => {
    // This is a theoretical test - in practice, JSON.stringify would break
    const circularObj = { name: 'Circular' };
    (circularObj as any).self = circularObj;
    
    render(
      <DataTablePro 
        data={[{ id: 1, name: circularObj.name }]} 
        columns={mockProps.columns}
      />
    );
    
    expect(screen.getByText('Circular')).toBeInTheDocument();
  });

  it('handles edge case: very large numbers', () => {
    const largeNumData = [
      { id: Number.MAX_SAFE_INTEGER, name: 'Big ID' },
    ];
    
    render(<DataTablePro data={largeNumData} columns={mockProps.columns} />);
    
    expect(screen.getByText('Big ID')).toBeInTheDocument();
  });

  it('handles edge case: very small numbers', () => {
    const smallNumData = [
      { id: Number.MIN_SAFE_INTEGER, name: 'Small ID' },
    ];
    
    render(<DataTablePro data={smallNumData} columns={mockProps.columns} />);
    
    expect(screen.getByText('Small ID')).toBeInTheDocument();
  });

  it('handles edge case: scientific notation numbers', () => {
    const sciNotationData = [
      { id: 1e10, name: 'Scientific Notation' },
    ];
    
    render(<DataTablePro data={sciNotationData} columns={mockProps.columns} />);
    
    expect(screen.getByText('Scientific Notation')).toBeInTheDocument();
  });

  it('handles edge case: very long strings', () => {
    const veryLongString = 'A'.repeat(5000);
    render(
      <DataTablePro 
        data={[{ id: 1, name: veryLongString }]} 
        columns={mockProps.columns}
      />
    );
    
    // Should handle gracefully with truncation
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('handles edge case: special regex characters', () => {
    const regexData = [
      { id: 1, name: 'Test & <script>alert("xss")</script>' },
    ];
    
    render(<DataTablePro data={regexData} columns={mockProps.columns} />);
    
    expect(screen.getByText('Test & <script>alert("xss")</script>')).toBeInTheDocument();
  });

  it('handles edge case: whitespace-only strings', () => {
    const whitespaceData = [
      { id: 1, name: '   ' },
    ];
    
    render(<DataTablePro data={whitespaceData} columns={mockProps.columns} />);
    
    expect(screen.getByText('   ')).toBeInTheDocument();
  });

  it('handles edge case: tab characters', () => {
    const tabData = [
      { id: 1, name: '\tTab\t' },
    ];
    
    render(<DataTablePro data={tabData} columns={mockProps.columns} />);
    
    expect(screen.getByText('\tTab\t')).toBeInTheDocument();
  });

  it('handles edge case: newlines', () => {
    const newlineData = [
      { id: 1, name: 'Line1\nLine2' },
    ];
    
    render(<DataTablePro data={newlineData} columns={mockProps.columns} />);
    
    expect(screen.getByText('Line1')).toBeInTheDocument();
  });

  it('handles edge case: mixed whitespace', () => {
    const mixedWhitespace = [
      { id: 1, name: ' \t\n Mixed \t\n ' },
    ];
    
    render(<DataTablePro data={mixedWhitespace} columns={mockProps.columns} />);
    
    expect(screen.getByText('Mixed')).toBeInTheDocument();
  });

  it('handles edge case: unicode whitespace', () => {
    const unicodeWhitespace = [
      { id: 1, name: ' \u200B ZeroWidthSpace' },
    ];
    
    render(<DataTablePro data={unicodeWhitespace} columns={mockProps.columns} />);
    
    expect(screen.getByText('ZeroWidthSpace')).toBeInTheDocument();
  });

  it('handles edge case: combining characters', () => {
    const combining = [
      { id: 1, name: 'e\u0301' }, // é as e + combining acute
    ];
    
    render(<DataTablePro data={combining} columns={mockProps.columns} />);
    
    expect(screen.getByText('é')).toBeInTheDocument();
  });

  it('handles edge case: ligatures', () => {
    const ligature = [
      { id: 1, name: 'ﬁ' }, // fi ligature
    ];
    
    render(<DataTablePro data={ligature} columns={mockProps.columns} />);
    
    expect(screen.getByText('ﬁ')).toBeInTheDocument();
  });

  it('handles edge case: diacritics', () => {
    const diacritic = [
      { id: 1, name: 'ñ' }, // Spanish ñ
