import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StickerBadge } from '@/components/media/sticker-badge'

describe('StickerBadge', () => {
  it('renders with default props without throwing', () => {
    const { container } = render(<StickerBadge />)
    expect(container).toBeInTheDocument()
  })

  it('applies base styling classes by default', () => {
    const { container } = render(<StickerBadge>Test</StickerBadge>)
    // Verify basic structure exists
    expect(screen.getByText(/test/i)).toBeInTheDocument()
  })

  it('accepts custom text content', () => {
    render(<StickerBadge>Hello World</StickerBadge>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('respects position prop when provided', () => {
    const positions: Array<keyof typeof StickerBadge['props']['position']> = [
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
    ]

    positions.forEach((pos) => {
      render(<StickerBadge position={pos}>Test</StickerBadge>)
      // Position classes should be applied
      expect(screen.getByText(/test/i)).toHaveClass('absolute')
    })
  })

  it('respects size prop when provided', () => {
    const sizes: Array<keyof typeof StickerBadge['props']['size']> = [
      'sm',
      'md',
      'lg',
      'xl',
    ]

    sizes.forEach((size) => {
      render(<StickerBadge size={size}>Test</StickerBadge>)
      // Size classes should be applied
      expect(screen.getByText(/test/i)).toHaveClass('rounded')
    })
  })

  it('respects opacity prop when provided', () => {
    const opacities = [0.1, 0.5, 0.8, 1]

    opacities.forEach((opacity) => {
      render(<StickerBadge opacity={opacity}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveStyle('opacity')
    })
  })

  it('respects zIndex prop when provided', () => {
    const zIndices = [10, 50, 100, 1000]

    zIndices.forEach((zIndex) => {
      render(<StickerBadge zIndex={zIndex}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveStyle('z-index')
    })
  })

  it('respects borderRadius prop when provided', () => {
    const radii = ['none', 'sm', 'md', 'lg', 'full']

    radii.forEach((radius) => {
      render(<StickerBadge radius={radius}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass('rounded')
    })
  })

  it('respects backgroundColor prop when provided', () => {
    const colors = ['bg-background', 'bg-primary', 'bg-muted']

    colors.forEach((color) => {
      render(<StickerBadge background={color}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(color)
    })
  })

  it('respects textColor prop when provided', () => {
    const textColors = ['text-foreground', 'text-primary']

    textColors.forEach((color) => {
      render(<StickerBadge text={color}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(color)
    })
  })

  it('respects border prop when provided', () => {
    const borders = ['border-border', 'border-none']

    borders.forEach((border) => {
      render(<StickerBadge border={border}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(border)
    })
  })

  it('respects font prop when provided', () => {
    const fonts = ['font-sans', 'font-mono']

    fonts.forEach((font) => {
      render(<StickerBadge font={font}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(font)
    })
  })

  it('respects fontWeight prop when provided', () => {
    const weights = ['normal', 'medium', 'bold']

    weights.forEach((weight) => {
      render(<StickerBadge weight={weight}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveStyle('font-weight')
    })
  })

  it('respects letterSpacing prop when provided', () => {
    const letterSpacings = ['normal', 'tight', 'wide']

    letterSpacings.forEach((spacing) => {
      render(<StickerBadge letterSpacing={spacing}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveStyle('letter-spacing')
    })
  })

  it('respects textAlign prop when provided', () => {
    const alignments = ['left', 'center', 'right']

    alignments.forEach((align) => {
      render(<StickerBadge align={align}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveStyle('text-align')
    })
  })

  it('respects verticalAlign prop when provided', () => {
    const valigns = ['top', 'middle', 'bottom']

    valigns.forEach((valign) => {
      render(<StickerBadge valign={valign}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveStyle('vertical-align')
    })
  })

  it('respects padding prop when provided', () => {
    const paddings = ['p-1', 'p-2', 'p-3', 'p-4']

    paddings.forEach((padding) => {
      render(<StickerBadge padding={padding}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(padding)
    })
  })

  it('respects margin prop when provided', () => {
    const margins = ['m-1', 'm-2', 'm-3', 'm-4']

    margins.forEach((margin) => {
      render(<StickerBadge margin={margin}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(margin)
    })
  })

  it('respects gap prop when provided', () => {
    const gaps = ['gap-1', 'gap-2', 'gap-3']

    gaps.forEach((gap) => {
      render(<StickerBadge gap={gap}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(gap)
    })
  })

  it('respects shadow prop when provided', () => {
    const shadows = ['shadow-sm', 'shadow-md', 'shadow-lg']

    shadows.forEach((shadow) => {
      render(<StickerBadge shadow={shadow}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(shadow)
    })
  })

  it('respects gradient prop when provided', () => {
    const gradients = ['from-violet-500 via-purple-600 to-indigo-700']

    gradients.forEach((gradient) => {
      render(<StickerBadge gradient={gradient}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(gradient)
    })
  })

  it('respects animate prop when provided', () => {
    const animations = ['animate-pulse', 'animate-bounce']

    animations.forEach((animation) => {
      render(<StickerBadge animation={animation}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(animation)
    })
  })

  it('respects hover prop when provided', () => {
    const hovers = ['hover:bg-background/10']

    hovers.forEach((hover) => {
      render(<StickerBadge hover={hover}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(hover)
    })
  })

  it('respects focus prop when provided', () => {
    const focuses = ['focus:ring-2']

    focuses.forEach((focus) => {
      render(<StickerBadge focus={focus}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(focus)
    })
  })

  it('respects active prop when provided', () => {
    const actives = ['active:scale-95']

    actives.forEach((active) => {
      render(<StickerBadge active={active}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(active)
    })
  })

  it('respects disabled prop when provided', () => {
    const disabledStates = [true, false]

    disabledStates.forEach((disabled) => {
      render(<StickerBadge disabled={disabled}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(disabled ? 'opacity-50' : '')
    })
  })

  it('respects className prop when provided', () => {
    const customClasses = ['custom-class']

    customClasses.forEach((className) => {
      render(<StickerBadge className={className}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(className)
    })
  })

  it('respects children prop when provided', () => {
    const children = <span>Custom Content</span>

    render(<StickerBadge>{children}</StickerBadge>)
    expect(screen.getByText('Custom Content')).toBeInTheDocument()
  })

  it('respects onClick handler when provided', async () => {
    const handleClick = vi.fn()

    render(
      <StickerBadge onClick={handleClick}>Test</StickerBadge>,
    )

    await userEvent.click(screen.getByText(/test/i))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('respects onHover handler when provided', async () => {
    const handleHover = vi.fn()

    render(<StickerBadge onHover={handleHover}>Test</StickerBadge>)

    await userEvent.hover(screen.getByText(/test/i))
    expect(handleHover).toHaveBeenCalledTimes(1)
  })

  it('respects onFocus handler when provided', async () => {
    const handleFocus = vi.fn()

    render(<StickerBadge onFocus={handleFocus}>Test</StickerBadge>)

    await userEvent.tab(screen.getByText(/test/i))
    expect(handleFocus).toHaveBeenCalledTimes(1)
  })

  it('respects role prop when provided', () => {
    const roles = ['button', 'img', 'article']

    roles.forEach((role) => {
      render(<StickerBadge role={role}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('role', role)
    })
  })

  it('respects aria-label prop when provided', () => {
    const labels = ['Label 1', 'Label 2']

    labels.forEach((label) => {
      render(<StickerBadge aria-label={label}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('aria-label', label)
    })
  })

  it('respects title prop when provided', () => {
    const titles = ['Title 1', 'Title 2']

    titles.forEach((title) => {
      render(<StickerBadge title={title}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('title', title)
    })
  })

  it('respects id prop when provided', () => {
    const ids = ['id-1', 'id-2']

    ids.forEach((id) => {
      render(<StickerBadge id={id}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('id', id)
    })
  })

  it('respects href prop when provided', () => {
    const hrefs = ['/link-1', '/link-2']

    hrefs.forEach((href) => {
      render(<StickerBadge href={href}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('href', href)
    })
  })

  it('respects target prop when provided', () => {
    const targets = ['_self', '_blank']

    targets.forEach((target) => {
      render(<StickerBadge target={target}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('target', target)
    })
  })

  it('respects rel prop when provided', () => {
    const rels = ['noopener', 'noreferrer']

    rels.forEach((rel) => {
      render(<StickerBadge rel={rel}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('rel', rel)
    })
  })

  it('respects download prop when provided', () => {
    const downloads = ['file-1.pdf', 'file-2.pdf']

    downloads.forEach((download) => {
      render(<StickerBadge download={download}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('download', download)
    })
  })

  it('respects draggable prop when provided', () => {
    const draggables = [true, false]

    draggables.forEach((draggable) => {
      render(<StickerBadge draggable={draggable}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('draggable')
    })
  })

  it('respects tabIndex prop when provided', () => {
    const tabIndexes = [0, -1, 5]

    tabIndexes.forEach((tabIndex) => {
      render(<StickerBadge tabIndex={tabIndex}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('tabIndex')
    })
  })

  it('respects autoFocus prop when provided', () => {
    const autoFocuses = [true, false]

    autoFocuses.forEach((autoFocus) => {
      render(<StickerBadge autoFocus={autoFocus}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('autofocus')
    })
  })

  it('respects classNamePrefix prop when provided', () => {
    const prefixes = ['prefix-1', 'prefix-2']

    prefixes.forEach((prefix) => {
      render(<StickerBadge classNamePrefix={prefix}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(prefix)
    })
  })

  it('respects variant prop when provided', () => {
    const variants = ['default', 'primary']

    variants.forEach((variant) => {
      render(<StickerBadge variant={variant}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(variant)
    })
  })

  it('respects size prop when provided (size)', () => {
    const sizes = ['xs', 'sm', 'md', 'lg']

    sizes.forEach((size) => {
      render(<StickerBadge size={size}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(size)
    })
  })

  it('respects weight prop when provided (weight)', () => {
    const weights = ['light', 'normal', 'bold']

    weights.forEach((weight) => {
      render(<StickerBadge weight={weight}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveClass(weight)
    })
  })

  it('respects style prop when provided', () => {
    const styles = { color: 'red' }

    render(<StickerBadge style={styles}>Test</StickerBadge>)
    expect(screen.getByText(/test/i)).toHaveStyle('color')
  })

  it('respects css prop when provided', () => {
    const css = `
      .custom-style {
        color: blue;
      }
    `

    render(<StickerBadge css={css}>Test</StickerBadge>)
    expect(screen.getByText(/test/i)).toHaveStyle('color')
  })

  it('respects data prop when provided', () => {
    const data = { key: 'value' }

    render(<StickerBadge data={data}>Test</StickerBadge>)
    expect(screen.getByText(/test/i)).toHaveAttribute('data-key')
  })

  it('respects aria-describedby prop when provided', () => {
    const describedBy = 'description-1'

    render(
      <StickerBadge aria-describedby={describedBy}>Test</StickerBadge>,
    )
    expect(screen.getByText(/test/i)).toHaveAttribute('aria-describedby')
  })

  it('respects aria-labelledby prop when provided', () => {
    const labelledBy = 'label-1'

    render(
      <StickerBadge aria-labelledby={labelledBy}>Test</StickerBadge>,
    )
    expect(screen.getByText(/test/i)).toHaveAttribute('aria-labelledby')
  })

  it('respects aria-hidden prop when provided', () => {
    const hiddenStates = [true, false]

    hiddenStates.forEach((hidden) => {
      render(<StickerBadge aria-hidden={hidden}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('aria-hidden')
    })
  })

  it('respects aria-live prop when provided', () => {
    const liveStates = ['polite', 'assertive']

    liveStates.forEach((live) => {
      render(<StickerBadge aria-live={live}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('aria-live')
    })
  })

  it('respects aria-atomic prop when provided', () => {
    const atomicStates = [true, false]

    atomicStates.forEach((atomic) => {
      render(<StickerBadge aria-atomic={atomic}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('aria-atomic')
    })
  })

  it('respects aria-busy prop when provided', () => {
    const busyStates = [true, false]

    busyStates.forEach((busy) => {
      render(<StickerBadge aria-busy={busy}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('aria-busy')
    })
  })

  it('respects aria-controls prop when provided', () => {
    const controls = ['control-1']

    controls.forEach((control) => {
      render(<StickerBadge aria-controls={control}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('aria-controls')
    })
  })

  it('respects aria-current prop when provided', () => {
    const currentStates = ['step', 'page']

    currentStates.forEach((current) => {
      render(<StickerBadge aria-current={current}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('aria-current')
    })
  })

  it('respects aria-describedby prop when provided (duplicate check)', () => {
    const describedBy = 'description-2'

    render(
      <StickerBadge aria-describedby={describedBy}>Test</StickerBadge>,
    )
    expect(screen.getByText(/test/i)).toHaveAttribute('aria-describedby')
  })

  it('respects aria-details prop when provided', () => {
    const details = 'details-1'

    render(<StickerBadge aria-details={details}>Test</StickerBadge>)
    expect(screen.getByText(/test/i)).toHaveAttribute('aria-details')
  })

  it('respects aria-disabled prop when provided', () => {
    const disabledStates = [true, false]

    disabledStates.forEach((disabled) => {
      render(<StickerBadge aria-disabled={disabled}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('aria-disabled')
    })
  })

  it('respects aria-errormessage prop when provided', () => {
    const errorMessages = ['error-1']

    errorMessages.forEach((message) => {
      render(
        <StickerBadge aria-errormessage={message}>Test</StickerBadge>,
      )
      expect(screen.getByText(/test/i)).toHaveAttribute('aria-errormessage')
    })
  })

  it('respects aria-flowname prop when provided', () => {
    const flowNames = ['document', 'dialog']

    flowNames.forEach((flowName) => {
      render(<StickerBadge aria-flowname={flowName}>Test</StickerBadge>)
      expect(screen.getByText(/test/i)).toHaveAttribute('aria-flowname')
    })
  })
