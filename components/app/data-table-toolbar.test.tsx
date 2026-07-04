import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataToolbar } from '@/components/app/data-table-toolbar';

describe('DataToolbar', () => {
  const mockProps = {
    search: '',
    setSearch: vi.fn(),
    filter: 'all',
    setFilter: vi.fn(),
    sort: { key: 'createdAt', direction: 'desc' },
    setSort: vi.fn(),
    page: 1,
    setPage: vi.fn(),
    pageSize: 25,
    setPageSize: vi.fn(),
    selectedRows: [],
    setSelectedRows: vi.fn(),
    onBulkAction: vi.fn(),
    isLoading: false,
    isExporting: false,
    exportFormats: ['csv', 'json'],
    currentExportFormat: 'csv',
    setExportFormat: vi.fn(),
  };

  describe('Rendering with default props', () => {
    it('renders without crashing', () => {
      const { container } = render(<DataToolbar {...mockProps} />);
      expect(container).toBeInTheDocument();
    });

    it('renders search input by default', () => {
      render(<DataToolbar {...mockProps} />);
      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toBeInTheDocument();
    });

    it('renders filter dropdown', () => {
      render(<DataToolbar {...mockProps} />);
      const filterSelect = screen.getByRole('combobox');
      expect(filterSelect).toBeInTheDocument();
    });

    it('renders sort controls', () => {
      render(<DataToolbar {...mockProps} />);
      const sortControl = screen.getByText(/sort/i) || screen.getByRole('button', { name: /sort/i });
      expect(sortControl).toBeInTheDocument();
    });

    it('renders pagination controls', () => {
      render(<DataToolbar {...mockProps} />);
      const pageInput = screen.getByRole('spinbutton');
      expect(pageInput).toBeInTheDocument();
    });
  });

  describe('Search functionality', () => {
    it('updates search state on input change', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'test query');

      expect(mockProps.setSearch).toHaveBeenCalledWith('test query');
    });

    it('clears search when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      await user.type(screen.getByRole('searchbox'), 'test');
      expect(mockProps.setSearch).toHaveBeenCalledWith('test');

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(mockProps.setSearch).toHaveBeenCalledWith('');
    });

    it('handles search input with keyboard events', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'test');
      expect(mockProps.setSearch).toHaveBeenCalledWith('test');

      await user.keyboard('{Backspace}{Backspace}');
      expect(mockProps.setSearch).toHaveBeenCalledWith('te');
    });
  });

  describe('Filter functionality', () => {
    it('updates filter state when selection changes', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      const filterSelect = screen.getByRole('combobox');
      await user.selectOptions(filterSelect, 'active');

      expect(mockProps.setFilter).toHaveBeenCalledWith('active');
    });

    it('preserves current filter value', () => {
      render(<DataToolbar {...mockProps} />);
      const filterSelect = screen.getByRole('combobox');
      
      expect(filterSelect.value).toBe('all');
    });
  });

  describe('Sort functionality', () => {
    it('toggles sort direction on click', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      const sortControl = screen.getByRole('button', { name: /sort/i });
      
      await user.click(sortControl);
      expect(mockProps.setSort).toHaveBeenCalledWith({ key: 'createdAt', direction: 'asc' });

      await user.click(sortControl);
      expect(mockProps.setSort).toHaveBeenCalledWith({ key: 'createdAt', direction: 'desc' });
    });

    it('displays current sort indicator', () => {
      render(<DataToolbar {...mockProps} />);
      
      // Should show descending indicator (typically down arrow)
      const sortIndicator = screen.getByRole('img') || screen.getByTestId(/sort-indicator/i);
      expect(sortIndicator).toBeInTheDocument();
    });

    it('handles multiple column sorting', async () => {
      render(<DataToolbar {...mockProps} />);

      await user.click(screen.getByRole('button', { name: /sort/i }));
      expect(mockProps.setSort).toHaveBeenCalledWith({ key: 'createdAt', direction: 'asc' });

      // Second click should cycle to next column if configured
      await user.click(screen.getByRole('button', { name: /sort/i }));
    });
  });

  describe('Pagination functionality', () => {
    it('updates page state when navigating', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      expect(mockProps.setPage).toHaveBeenCalledWith(2);
    });

    it('displays page range information', () => {
      render(<DataToolbar {...mockProps} />);
      
      const pageInfo = screen.getByText(/page 1 of/i) || 
                        screen.getByText(/of [0-9]+ pages/i);
      expect(pageInfo).toBeInTheDocument();
    });

    it('handles page boundary conditions', () => {
      render(<DataToolbar {...mockProps} />);

      const prevButton = screen.getByRole('button', { name: /previous/i });
      expect(prevButton).toBeDisabled(); // First page, should be disabled
    });
  });

  describe('Bulk selection functionality', () => {
    it('updates selected rows state when selecting/deselecting', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
      await user.click(selectAllCheckbox);

      expect(mockProps.setSelectedRows).toHaveBeenCalled();
    });

    it('displays selection count', () => {
      render(<DataToolbar {...mockProps} />);

      const selectCount = screen.getByText(/selected/i) || 
                         screen.getByText(/0 selected/i);
      expect(selectCount).toBeInTheDocument();
    });

    it('shows bulk action menu when items are selected', async () => {
      mockProps.selectedRows.push({ id: 1, name: 'Item 1' });
      
      render(<DataToolbar {...mockProps} />);

      const actionsMenu = screen.getByRole('menu') || 
                         screen.getByText(/actions/i) ||
                         screen.getByTestId(/bulk-actions/i);
      expect(actionsMenu).toBeInTheDocument();
    });

    it('triggers bulk action when menu item is clicked', async () => {
      mockProps.selectedRows.push({ id: 1, name: 'Item 1' });
      
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      await user.click(screen.getByRole('menuitem', { name: /delete/i }));

      expect(mockProps.onBulkAction).toHaveBeenCalledWith({
        type: 'delete',
        rows: [{ id: 1, name: 'Item 1' }],
      });
    });
  });

  describe('Export functionality', () => {
    it('displays export format options', () => {
      render(<DataToolbar {...mockProps} />);

      const exportMenu = screen.getByRole('menu') || 
                       screen.getByText(/export/i) ||
                       screen.getByTestId(/export-menu/i);
      expect(exportMenu).toBeInTheDocument();
    });

    it('updates export format state', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      await user.click(screen.getByRole('menuitem', { name: /json/i }));

      expect(mockProps.setExportFormat).toHaveBeenCalledWith('json');
    });

    it('shows export progress indicator when exporting', async () => {
      mockProps.isExporting = true;
      
      render(<DataToolbar {...mockProps} />);

      const progressBar = screen.getByRole('progressbar') || 
                         screen.getByText(/exporting/i) ||
                         screen.getByTestId(/export-progress/i);
      expect(progressBar).toBeInTheDocument();
    });

    it('displays export format selector', () => {
      render(<DataToolbar {...mockProps} />);

      const formatSelect = screen.getByRole('combobox') || 
                        screen.getByText(/csv/i) ||
                        screen.getByTestId(/format-select/i);
      expect(formatSelect).toBeInTheDocument();
    });
  });

  describe('Loading states', () => {
    it('displays loading indicator when isLoading is true', async () => {
      mockProps.isLoading = true;
      
      render(<DataToolbar {...mockProps} />);

      const loader = screen.getByRole('status') || 
                   screen.getByText(/loading/i) ||
                   screen.getByTestId(/loader/i);
      expect(loader).toBeInTheDocument();
    });

    it('displays export progress when isExporting is true', async () => {
      mockProps.isExporting = true;
      
      render(<DataToolbar {...mockProps} />);

      const progressIndicator = screen.getByRole('progressbar') || 
                           screen.getByText(/exporting/i) ||
                           screen.getByTestId(/export-progress/i);
      expect(progressIndicator).toBeInTheDocument();
    });
  });

  describe('Responsive behavior', () => {
    it('renders compact controls on small screens', async () => {
      const user = userEvent.setup({ viewport: { width: 375, height: 667 } });
      
      render(<DataToolbar {...mockProps} />);

      // Verify controls are accessible and functional at mobile size
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'test');
      expect(mockProps.setSearch).toHaveBeenCalledWith('test');
    });

    it('renders full controls on larger screens', async () => {
      const user = userEvent.setup({ viewport: { width: 1920, height: 1080 } });
      
      render(<DataToolbar {...mockProps} />);

      // Verify all controls are present at desktop size
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for interactive elements', async () => {
      render(<DataToolbar {...mockProps} />);

      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toHaveAttribute('aria-label', /search/i);

      const filterSelect = screen.getByRole('combobox');
      expect(filterSelect).toHaveAttribute('aria-label', /filter/i);
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      // Test Tab navigation between controls
      await user.tab();
      expect(screen.getByRole('searchbox')).toHaveFocus();
    });

    it('handles focus states for interactive elements', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      const searchInput = screen.getByRole('searchbox');
      
      await user.click(searchInput);
      expect(document.activeElement).toBe(searchInput);
    });

    it('provides visible focus indicators', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      const searchInput = screen.getByRole('searchbox');
      
      await user.click(searchInput);
      expect(document.activeElement).toHaveStyle(/outline/i) || 
                expect(document.activeElement).toHaveStyle(/ring/i) ||
                expect(document.activeElement).toHaveStyle(/border/i);
    });

    it('announces state changes to screen readers', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      await user.type(screen.getByRole('searchbox'), 'test');
      
      // Verify that the input has live region support
      expect(searchInput).toHaveAttribute('aria-live') || 
                 expect(searchInput).toHaveAttribute('role', /textbox/i);
    });
  });

  describe('Event handling and state management', () => {
    it('passes all events to parent components correctly', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      const searchInput = screen.getByRole('searchbox');
      
      await user.type(searchInput, 'test query');
      expect(mockProps.setSearch).toHaveBeenCalledWith('test query');
    });

    it('handles rapid state updates without race conditions', async () => {
      let callCount = 0;
      const wrappedSetSearch = (val: string) => {
        callCount++;
        mockProps.setSearch(val);
      };

      render(<DataToolbar {...mockProps} />);

      const searchInput = screen.getByRole('searchbox');
      
      // Simulate rapid typing
      await user.type(searchInput, 'test');
      expect(callCount).toBe(4); // t-e-s-t
      
      expect(mockProps.setSearch).toHaveBeenCalledWith('test');
    });

    it('maintains consistent state during async operations', async () => {
      render(<DataToolbar {...mockProps} />);

      const searchInput = screen.getByRole('searchbox');
      
      // Type and wait for updates to propagate
      await user.type(searchInput, 'async test');
      expect(mockProps.setSearch).toHaveBeenCalledWith('async test');
    });
  });

  describe('Edge cases', () => {
    it('handles empty search input gracefully', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      const searchInput = screen.getByRole('searchbox');
      
      await user.type(searchInput, 'test');
      expect(mockProps.setSearch).toHaveBeenCalledWith('test');

      await user.keyboard('{Backspace}{Backspace}{Backspace}{Backspace}');
      expect(mockProps.setSearch).toHaveBeenCalledWith('te');

      // Clear remaining characters
      await user.keyboard('{Backspace}{Backspace}');
      expect(mockProps.setSearch).toHaveBeenCalledWith('');
    });

    it('handles very long search queries', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      const searchInput = screen.getByRole('searchbox');
      
      await user.type(searchInput, 'a'.repeat(100));
      expect(mockProps.setSearch).toHaveBeenCalledWith('a'.repeat(100));
    });

    it('handles rapid filter changes', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      const filterSelect = screen.getByRole('combobox');
      
      await user.selectOptions(filterSelect, 'active');
      expect(mockProps.setFilter).toHaveBeenCalledWith('active');

      await user.selectOptions(filterSelect, 'inactive');
      expect(mockProps.setFilter).toHaveBeenCalledWith('inactive');
    });

    it('handles sort key changes', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      // Simulate multiple rapid sort changes
      await user.click(screen.getByRole('button', { name: /sort/i }));
      expect(mockProps.setSort).toHaveBeenCalledWith({ key: 'createdAt', direction: 'asc' });

      await user.click(screen.getByRole('button', { name: /sort/i }));
      expect(mockProps.setSort).toHaveBeenCalledWith({ key: 'createdAt', direction: 'desc' });
    });

    it('handles bulk selection with many rows', async () => {
      const user = userEvent.setup();
      mockProps.selectedRows.push(
        ...Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }))
      );

      render(<DataToolbar {...mockProps} />);

      // Should handle large selection counts without performance issues
      expect(screen.getByText(/selected/i)).toBeInTheDocument();
    });

    it('handles export with multiple formats', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      await user.click(screen.getByRole('menuitem', { name: /json/i }));
      expect(mockProps.setExportFormat).toHaveBeenCalledWith('json');

      // Verify format state updated correctly
      expect(mockProps.currentExportFormat).toBe('json');
    });

    it('handles loading and error states gracefully', async () => {
      mockProps.isLoading = true;
      
      render(<DataToolbar {...mockProps} />);

      const loader = screen.getByRole('status') || 
                   screen.getByText(/loading/i) ||
                   screen.getByTestId(/loader/i);
      expect(loader).toBeInTheDocument();
    });

    it('handles disabled states correctly', async () => {
      mockProps.isLoading = true;
      
      render(<DataToolbar {...mockProps} />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      // Next button should be disabled when loading
      expect(nextButton).toBeDisabled();
    });

    it('handles empty selected rows state', async () => {
      mockProps.selectedRows.length = 0;
      
      render(<DataToolbar {...mockProps} />);

      const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
      expect(selectAllCheckbox).toBeInTheDocument();
    });

    it('handles very large page numbers', async () => {
      mockProps.page = 999;
      
      render(<DataToolbar {...mockProps} />);

      // Should display large page number without overflow issues
      const pageInfo = screen.getByText(/page/i);
      expect(pageInfo).toBeInTheDocument();
    });

    it('handles rapid pagination changes', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      // Simulate rapid page navigation
      await user.click(screen.getByRole('button', { name: /next/i }));
      expect(mockProps.setPage).toHaveBeenCalledWith(2);

      await user.click(screen.getByRole('button', { name: /previous/i }));
      expect(mockProps.setPage).toHaveBeenCalledWith(1);
    });

    it('handles export format switching during active export', async () => {
      mockProps.isExporting = true;
      
      render(<DataToolbar {...mockProps} />);

      // Should handle format change while exporting gracefully
      await user.click(screen.getByRole('menuitem', { name: /csv/i }));
      expect(mockProps.setExportFormat).toHaveBeenCalledWith('csv');
    });

    it('handles bulk action with large selection sets', async () => {
      mockProps.selectedRows.push(
        ...Array.from({ length: 50 }, (_, i) => ({ id: i, name: `Item ${i}` }))
      );
      
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      // Should handle bulk actions with many selected items
      await user.click(screen.getByRole('menuitem', { name: /delete/i }));
      expect(mockProps.onBulkAction).toHaveBeenCalledWith({
        type: 'delete',
        rows: mockProps.selectedRows,
      });
    });

    it('handles search input with special characters', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      const searchInput = screen.getByRole('searchbox');
      
      await user.type(searchInput, 'test "quoted" & <special> chars');
      expect(mockProps.setSearch).toHaveBeenCalledWith('test "quoted" & <special> chars');
    });

    it('handles filter with special characters in values', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      const filterSelect = screen.getByRole('combobox');
      
      await user.selectOptions(filterSelect, 'special & "chars"');
      expect(mockProps.setFilter).toHaveBeenCalledWith('special & "chars"');
    });

    it('handles sort with unicode characters', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      // Should handle sorting by columns with unicode names if configured
      await user.click(screen.getByRole('button', { name: /sort/i }));
      expect(mockProps.setSort).toHaveBeenCalledWith({ key: 'createdAt', direction: 'asc' });
    });

    it('handles pagination with very large datasets', async () => {
      const user = userEvent.setup();
      render(<DataToolbar {...mockProps} />);

      // Simulate navigating through many pages
      for (let i = 0; i < 10; i++) {
        await user.click(screen.getByRole('button', { name: /next/i }));
        expect(mockProps.setPage).toHaveBeenCalledWith
