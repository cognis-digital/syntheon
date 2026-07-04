import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface ExperienceItem {
  company: string
  role: string
  period: string
  description: string[]
}

interface ProjectItem {
  title: string
  description: string
  technologies: string[]
  link?: string
}

export interface ResumeProps {
  name: string
  title: string
  email: string
  phone?: string
  location?: string
  website?: string
  experiences: ExperienceItem[]
  projects: ProjectItem[]
  skills: string[]
  socialLinks?: Record<string, string>
}

export interface ResumeSectionProps {
  children: React.ReactNode
  className?: string
}

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
)

const StaggerContainer = ({ children, staggerDelay = 0 }: { children: React.ReactNode; staggerDelay?: number }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
    {children}
  </motion.div>
)

const StaggeredChildren = ({ children, staggerDelay = 0 }: { children: React.ReactNode; staggerDelay?: number }) => (
  <StaggerContainer>
    {Array.isArray(children) ? (
      children.map((child, index) => (
        <FadeIn key={index} delay={staggerDelay + index * 0.1}>{child}</FadeIn>
      ))
    ) : (
      <FadeIn>{children}</FadeIn>
    )}
  </StaggerContainer>
)

export function Resume({ name, title, email, phone, location, website, experiences, projects, skills, socialLinks }: ResumeProps) {
  const [scrollProgress] = useScroll()
  const progress = useTransform(scrollProgress, [0, 1], [0, 1])

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground selection:bg-primary/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center max-w-3xl"
        >
          <FadeIn>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary via-purple-200 to-primary text-transparent bg-clip-text">
              {name}
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {title}
            </p>
          </FadeIn>

          <StaggeredChildren staggerDelay={0.3}>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {email && (
                <Badge variant="outline" className="px-6 py-2 text-sm border-border">
                  ✉️ {email}
                </Badge>
              )}
              {phone && (
                <Badge variant="outline" className="px-6 py-2 text-sm border-border">
                  📱 {phone}
                </Badge>
              )}
              {location && (
                <Badge variant="outline" className="px-6 py-2 text-sm border-border">
                  📍 {location}
                </Badge>
              )}
              {website && (
                <Badge variant="outline" className="px-6 py-2 text-sm border-border">
                  🌐 {website}
                </Badge>
              )}
            </div>

            <StaggeredChildren staggerDelay={0.4}>
              <div className="flex justify-center gap-3">
                {socialLinks && Object.entries(socialLinks).map(([platform, url], index) => (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    className="p-3 rounded-full bg-muted hover:bg-primary/20 transition-colors border border-border"
                  >
                    <span className="text-sm font-medium">{platform}</span>
                  </motion.a>
                ))}
              </div>
            </StaggeredChildren>
          </StaggeredChildren>

          {/* Progress Bar */}
          <FadeIn delay={0.6}>
            <div className="mt-12 max-w-xs mx-auto">
              <motion.div
                className="h-1 bg-muted rounded-full overflow-hidden"
                style={{ width: '100%' }}
              >
                <motion.div
                  className="h-full bg-primary shadow-lg shadow-primary/50"
                  initial={{ x: '-100%' }}
                  animate={{ x: 0, transition: { duration: 2, ease: [0.34, 1.56, 0.64, 1] } }}
                />
              </motion.div>
            </div>
          </FadeIn>
        </motion.div>

        {/* Background Gradient Orbs */}
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
        </motion.div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-6">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-purple-200 text-transparent bg-clip-text">
            Technical Expertise
          </h2>
        </FadeIn>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors cursor-default"
              >
                <span className="text-lg font-medium">{skill}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 px-6">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-purple-200 text-transparent bg-clip-text">
            Professional Experience
          </h2>
        </FadeIn>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <Card className="border-border bg-card/50 backdrop-blur-sm hover:bg-card transition-colors">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                      >
                        <h3 className="text-xl font-bold">{exp.role}</h3>
                        <p className="text-primary">{exp.company}</p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="ml-auto md:ml-0"
                      >
                        <Badge variant="secondary">{exp.period}</Badge>
                      </motion.div>
                    </div>

                    <Separator className="my-6 border-border/50" />

                    <StaggeredChildren staggerDelay={0.2}>
                      {exp.description.map((desc, i) => (
                        <p key={i} className="text-muted-foreground leading-relaxed">
                          {desc}
                        </p>
                      ))}
                    </StaggeredChildren>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-purple-200 text-transparent bg-clip-text">
            Featured Projects
          </h2>
        </FadeIn>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors h-full flex flex-col">
                  <CardContent className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-3">{project.title}</h3>

                    <StaggeredChildren staggerDelay={0.2}>
                      {project.description && (
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {project.description}
                        </p>
                      )}

                      {project.technologies.length > 0 && (
                        <>
                          <Separator className="my-4 border-border/50" />
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </>
                      )}

                      {project.link && (
                        <>
                          <Separator className="my-4 border-border/50" />
                          <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center justify-center gap-2 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors border border-border/50"
                          >
                            <span>View Project</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </motion.a>
                        </>
                      )}
                    </StaggeredChildren>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          {projects.length === 0 && (
            <FadeIn>
              <p className="text-center text-muted-foreground">No projects to display yet.</p>
            </FadeIn>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-24 px-6 border-t border-border/50 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

            <StaggeredChildren staggerDelay={0.1}>
              {email && (
                <motion.a
                  href={`mailto:${email}`}
                  whileHover={{ scale: 1.05 }}
                  className="inline-block px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Email Me
                </motion.a>
              )}

              {website && (
                <motion.a
                  href={`https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="inline-block px-8 py-4 rounded-xl bg-muted border border-border hover:bg-muted/80 transition-colors ml-4"
                >
                  Visit Website
                </motion.a>
              )}

              {phone && (
                <motion.a
                  href={`tel:${phone}`}
                  whileHover={{ scale: 1.05 }}
                  className="inline-block px-8 py-4 rounded-xl bg-muted border border-border hover:bg-muted/80 transition-colors ml-4"
                >
                  Call Me
                </motion.a>
              )}
            </StaggeredChildren>

            <FadeIn delay={0.3}>
              <Separator className="my-12 border-border/50" />

              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} {name}. Built with care and precision.
              </p>
            </FadeIn>
          </FadeIn>
        </div>
      </footer>
    </motion.div>
  )
}
