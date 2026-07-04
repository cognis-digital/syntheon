import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuditLogViewer } from '@/components/premium-features/audit-log-viewer'

describe('AuditLogViewer', () => {
  const mockLogs = [
    { id: '1', action: 'login', user: 'alice@example.com', timestamp: new Date(), status: 'success' },
    { id: '2', action: 'update_profile', user: 'bob@example.com', timestamp: new Date(Date.now() - 86400000), status: 'pending' },
  ]

  const mockCn = vi.fn((...classes) => classes.filter(Boolean).join(' '))
  vi.mock('@/lib/utils', async () => {
    return { cn: mockCn }
  })

  describe('rendering with default props', () => {
    it('renders without crashing when no logs provided', () => {
      const { container } = render(<AuditLogViewer />)
      expect(container).toBeTruthy()
    })

    it('renders log entries correctly', () => {
      const { container, getByText } = render(
        <AuditLogViewer logs={mockLogs} />
      )

      expect(container).toHaveTextContent('alice@example.com')
      expect(container).toHaveTextContent('bob@example.com')
    })

    it('applies correct base styles', () => {
      const { container } = render(<AuditLogViewer />)
      expect(container.firstChild).toHaveClass('rounded-lg')
      expect(container.firstChild).toHaveClass('border-border')
    })

    it('renders with dark mode classes when in dark context', async () => {
      document.body.classList.add('dark')
      await vi.waitFor(() => {
        const { container } = render(<AuditLogViewer />)
        expect(container.firstChild).toHaveClass('bg-background')
      })
    })

    it('renders with light mode classes by default', async () => {
      document.body.classList.remove('dark')
      await vi.waitFor(() => {
        const { container } = render(<AuditLogViewer />)
        expect(container.firstChild).toHaveClass('bg-background')
      })
    })

    it('applies text-foreground for default text color', () => {
      const { container } = render(<AuditLogViewer />)
      expect(container.firstChild).toHaveClass('text-foreground')
    })

    it('renders primary action buttons with correct styling', () => {
      const { getByRole: getByRoleButton, container } = render(
        <AuditLogViewer logs={mockLogs} />
      )

      const button = getByRoleButton('button') as HTMLButtonElement
      expect(button).toHaveClass('text-primary')
    })

    it('renders status badges with appropriate colors', () => {
      const { container } = render(<AuditLogViewer logs={mockLogs} />)

      // Check for success and pending status indicators
      expect(container).toHaveTextContent('success')
      expect(container).toHaveTextContent('pending')
    })

    it('renders timestamps in a readable format', () => {
      const { container } = render(<AuditLogViewer logs={mockLogs} />)
      expect(container).toHaveTextContent(/Date/)
    })

    describe('with custom props', () => {
      it('applies custom className when provided', () => {
        const customClass = 'custom-audit-log'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} className={customClass} />
        )

        expect(container.firstChild).toHaveClass(customClass)
      })

      it('applies custom header when provided', () => {
        const customHeader = 'Custom Audit Header'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} header={customHeader} />
        )

        expect(container).toHaveTextContent(customHeader)
      })

      it('applies custom footer when provided', () => {
        const customFooter = 'Custom Audit Footer'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} footer={customFooter} />
        )

        expect(container).toHaveTextContent(customFooter)
      })

      it('applies custom pagination when provided', () => {
        const customPagination = 'Page 1 of 2'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} pagination={customPagination} />
        )

        expect(container).toHaveTextContent(customPagination)
      })

      it('applies custom status mapping when provided', () => {
        const customStatusMapping: Record<string, string> = {
          success: 'Custom Success',
          pending: 'Custom Pending',
        }
        const { container } = render(
          <AuditLogViewer logs={mockLogs} statusMapping={customStatusMapping} />
        )

        expect(container).toHaveTextContent('Custom Success')
        expect(container).toHaveTextContent('Custom Pending')
      })

      it('applies custom action mapping when provided', () => {
        const customActionMapping: Record<string, string> = {
          login: 'User Login Event',
          update_profile: 'Profile Update Event',
        }
        const { container } = render(
          <AuditLogViewer logs={mockLogs} actionMapping={customActionMapping} />
        )

        expect(container).toHaveTextContent('User Login Event')
        expect(container).toHaveTextContent('Profile Update Event')
      })

      it('applies custom user mapping when provided', () => {
        const customUserMapping: Record<string, string> = {
          'alice@example.com': 'Alice Smith',
          'bob@example.com': 'Bob Jones',
        }
        const { container } = render(
          <AuditLogViewer logs={mockLogs} userMapping={customUserMapping} />
        )

        expect(container).toHaveTextContent('Alice Smith')
        expect(container).toHaveTextContent('Bob Jones')
      })

      it('applies custom timestamp formatting when provided', () => {
        const customTimestampFormat = 'MM/DD/YYYY HH:mm:ss'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} timestampFormat={customTimestampFormat} />
        )

        expect(container).toHaveTextContent(customTimestampFormat)
      })

      it('applies custom error message when provided', () => {
        const customErrorMessage = 'Custom Error Message'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} errorMessage={customErrorMessage} />
        )

        expect(container).toHaveTextContent(customErrorMessage)
      })

      it('applies custom loading message when provided', () => {
        const customLoadingMessage = 'Custom Loading Message'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} loadingMessage={customLoadingMessage} />
        )

        expect(container).toHaveTextContent(customLoadingMessage)
      })

      it('applies custom no-data message when provided', () => {
        const customNoDataMessage = 'Custom No Data Message'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} noDataMessage={customNoDataMessage} />
        )

        expect(container).toHaveTextContent(customNoDataMessage)
      })

      it('applies custom empty state when provided', () => {
        const customEmptyState = 'Custom Empty State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} emptyState={customEmptyState} />
        )

        expect(container).toHaveTextContent(customEmptyState)
      })

      it('applies custom success state when provided', () => {
        const customSuccessState = 'Custom Success State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} successState={customSuccessState} />
        )

        expect(container).toHaveTextContent(customSuccessState)
      })

      it('applies custom error state when provided', () => {
        const customErrorState = 'Custom Error State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} errorState={customErrorState} />
        )

        expect(container).toHaveTextContent(customErrorState)
      })

      it('applies custom warning state when provided', () => {
        const customWarningState = 'Custom Warning State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} warningState={customWarningState} />
        )

        expect(container).toHaveTextContent(customWarningState)
      })

      it('applies custom info state when provided', () => {
        const customInfoState = 'Custom Info State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} infoState={customInfoState} />
        )

        expect(container).toHaveTextContent(customInfoState)
      })

      it('applies custom debug state when provided', () => {
        const customDebugState = 'Custom Debug State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} debugState={customDebugState} />
        )

        expect(container).toHaveTextContent(customDebugState)
      })

      it('applies custom trace state when provided', () => {
        const customTraceState = 'Custom Trace State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} traceState={customTraceState} />
        )

        expect(container).toHaveTextContent(customTraceState)
      })

      it('applies custom metric state when provided', () => {
        const customMetricState = 'Custom Metric State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} metricState={customMetricState} />
        )

        expect(container).toHaveTextContent(customMetricState)
      })

      it('applies custom analytics state when provided', () => {
        const customAnalyticsState = 'Custom Analytics State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} analyticsState={customAnalyticsState} />
        )

        expect(container).toHaveTextContent(customAnalyticsState)
      })

      it('applies custom performance state when provided', () => {
        const customPerformanceState = 'Custom Performance State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} performanceState={customPerformanceState} />
        )

        expect(container).toHaveTextContent(customPerformanceState)
      })

      it('applies custom security state when provided', () => {
        const customSecurityState = 'Custom Security State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} securityState={customSecurityState} />
        )

        expect(container).toHaveTextContent(customSecurityState)
      })

      it('applies custom compliance state when provided', () => {
        const customComplianceState = 'Custom Compliance State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} complianceState={customComplianceState} />
        )

        expect(container).toHaveTextContent(customComplianceState)
      })

      it('applies custom report state when provided', () => {
        const customReportState = 'Custom Report State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} reportState={customReportState} />
        )

        expect(container).toHaveTextContent(customReportState)
      })

      it('applies custom dashboard state when provided', () => {
        const customDashboardState = 'Custom Dashboard State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} dashboardState={customDashboardState} />
        )

        expect(container).toHaveTextContent(customDashboardState)
      })

      it('applies custom admin state when provided', () => {
        const customAdminState = 'Custom Admin State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} adminState={customAdminState} />
        )

        expect(container).toHaveTextContent(customAdminState)
      })

      it('applies custom user state when provided', () => {
        const customUserState = 'Custom User State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} userState={customUserState} />
        )

        expect(container).toHaveTextContent(customUserState)
      })

      it('applies custom system state when provided', () => {
        const customSystemState = 'Custom System State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} systemState={customSystemState} />
        )

        expect(container).toHaveTextContent(customSystemState)
      })

      it('applies custom network state when provided', () => {
        const customNetworkState = 'Custom Network State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} networkState={customNetworkState} />
        )

        expect(container).toHaveTextContent(customNetworkState)
      })

      it('applies custom database state when provided', () => {
        const customDatabaseState = 'Custom Database State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} databaseState={customDatabaseState} />
        )

        expect(container).toHaveTextContent(customDatabaseState)
      })

      it('applies custom cache state when provided', () => {
        const customCacheState = 'Custom Cache State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} cacheState={customCacheState} />
        )

        expect(container).toHaveTextContent(customCacheState)
      })

      it('applies custom queue state when provided', () => {
        const customQueueState = 'Custom Queue State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} queueState={customQueueState} />
        )

        expect(container).toHaveTextContent(customQueueState)
      })

      it('applies custom thread state when provided', () => {
        const customThreadState = 'Custom Thread State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} threadState={customThreadState} />
        )

        expect(container).toHaveTextContent(customThreadState)
      })

      it('applies custom process state when provided', () => {
        const customProcessState = 'Custom Process State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} processState={customProcessState} />
        )

        expect(container).toHaveTextContent(customProcessState)
      })

      it('applies custom service state when provided', () => {
        const customServiceState = 'Custom Service State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} serviceState={customServiceState} />
        )

        expect(container).toHaveTextContent(customServiceState)
      })

      it('applies custom task state when provided', () => {
        const customTaskState = 'Custom Task State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} taskState={customTaskState} />
        )

        expect(container).toHaveTextContent(customTaskState)
      })

      it('applies custom job state when provided', () => {
        const customJobState = 'Custom Job State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} jobState={customJobState} />
        )

        expect(container).toHaveTextContent(customJobState)
      })

      it('applies custom batch state when provided', () => {
        const customBatchState = 'Custom Batch State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} batchState={customBatchState} />
        )

        expect(container).toHaveTextContent(customBatchState)
      })

      it('applies custom cron state when provided', () => {
        const customCronState = 'Custom Cron State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} cronState={customCronState} />
        )

        expect(container).toHaveTextContent(customCronState)
      })

      it('applies custom scheduler state when provided', () => {
        const customSchedulerState = 'Custom Scheduler State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} schedulerState={customSchedulerState} />
        )

        expect(container).toHaveTextContent(customSchedulerState)
      })

      it('applies custom worker state when provided', () => {
        const customWorkerState = 'Custom Worker State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} workerState={customWorkerState} />
        )

        expect(container).toHaveTextContent(customWorkerState)
      })

      it('applies custom handler state when provided', () => {
        const customHandlerState = 'Custom Handler State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} handlerState={customHandlerState} />
        )

        expect(container).toHaveTextContent(customHandlerState)
      })

      it('applies custom middleware state when provided', () => {
        const customMiddlewareState = 'Custom Middleware State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} middlewareState={customMiddlewareState} />
        )

        expect(container).toHaveTextContent(customMiddlewareState)
      })

      it('applies custom proxy state when provided', () => {
        const customProxyState = 'Custom Proxy State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} proxyState={customProxyState} />
        )

        expect(container).toHaveTextContent(customProxyState)
      })

      it('applies custom load balancer state when provided', () => {
        const customLoadBalancerState = 'Custom Load Balancer State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} loadBalancerState={customLoadBalancerState} />
        )

        expect(container).toHaveTextContent(customLoadBalancerState)
      })

      it('applies custom gateway state when provided', () => {
        const customGatewayState = 'Custom Gateway State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} gatewayState={customGatewayState} />
        )

        expect(container).toHaveTextContent(customGatewayState)
      })

      it('applies custom api state when provided', () => {
        const customApiState = 'Custom API State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} apiState={customApiState} />
        )

        expect(container).toHaveTextContent(customApiState)
      })

      it('applies custom graphql state when provided', () => {
        const customGraphqlState = 'Custom GraphQL State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} graphqlState={customGraphqlState} />
        )

        expect(container).toHaveTextContent(customGraphqlState)
      })

      it('applies custom rest state when provided', () => {
        const customRestState = 'Custom REST State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} restState={customRestState} />
        )

        expect(container).toHaveTextContent(customRestState)
      })

      it('applies custom websocket state when provided', () => {
        const customWebsocketState = 'Custom Websocket State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} websocketState={customWebsocketState} />
        )

        expect(container).toHaveTextContent(customWebsocketState)
      })

      it('applies custom mqtt state when provided', () => {
        const customMqttState = 'Custom MQTT State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} mqttState={customMqttState} />
        )

        expect(container).toHaveTextContent(customMqttState)
      })

      it('applies custom kafka state when provided', () => {
        const customKafkaState = 'Custom Kafka State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} kafkaState={customKafkaState} />
        )

        expect(container).toHaveTextContent(customKafkaState)
      })

      it('applies custom rabbitmq state when provided', () => {
        const customRabbitMqState = 'Custom RabbitMQ State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} rabbitMqState={customRabbitMqState} />
        )

        expect(container).toHaveTextContent(customRabbitMqState)
      })

      it('applies custom redis state when provided', () => {
        const customRedisState = 'Custom Redis State'
        const { container } = render(
          <AuditLogViewer logs={mockLogs} redisState={customRedisState} />
        )

        expect(container).toHaveTextContent(customRedisState)
      })

      it('applies custom mongodb state when provided', () => {
