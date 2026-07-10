import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "@phosphor-icons/react";
import { fadeUpBlur, staggerContainer, staggerItem } from "../lib/animations";

const faqs = [
  {
    q: "How does FlowBoard handle data security?",
    a: "FlowBoard is SOC 2 Type II certified with annual third-party audits. All data is encrypted at rest using AES-256 and in transit using TLS 1.3. We offer SSO via SAML 2.0 and OIDC, role-based access controls, and immutable audit logs. Enterprise customers can choose dedicated infrastructure with data residency in their region.",
  },
  {
    q: "Can I integrate with my existing tools?",
    a: "Yes. FlowBoard connects with GitHub, Slack, Notion, Linear, Jira, Figma, and Google Drive out of the box. Our REST and GraphQL APIs allow custom integrations with any tool. Enterprise plans include dedicated integration engineering support for complex workflows.",
  },
  {
    q: "What kind of support do you offer?",
    a: "Starter plans include community support and documentation access. Growth plans include priority support with a 4-hour response time during business hours. Enterprise plans come with a dedicated success manager, 24/7 support with a 1-hour SLA, and quarterly business reviews.",
  },
  {
    q: "How does the AI assistant work?",
    a: "FlowBoard's AI analyzes your workspace context — projects, documents, conversations, and decisions — to provide intelligent suggestions, answer questions, and automate routine tasks. It can summarize discussions, identify action items, surface relevant documents, and even create tickets based on conversations. The AI is fully transparent about its sources and respects your permission boundaries.",
  },
  {
    q: "Can I customize workflows for my team?",
    a: "Absolutely. FlowBoard supports custom workflows, statuses, fields, and automation rules. You can create templates for recurring projects, set up branching workflows for different task types, and automate status transitions based on triggers. Enterprise customers can build completely custom workflow engines on top of FlowBoard's platform.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const springTransition = {
    type: "spring" as const,
    stiffness: 200,
    damping: 25,
  };

  return (
    <section className="section-gradient py-28 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={fadeUpBlur}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1 text-[11px] font-medium tracking-[0.15em] text-primary uppercase backdrop-blur-sm">
            FAQ
          </span>
          <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
            Questions? We've got answers.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            Everything you need to know about FlowBoard.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-3xl"
        >
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              variants={staggerItem}
              className={`border-b border-white/[0.06] ${i === 0 ? "border-t" : ""}`}
            >
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 py-6 text-left transition-colors duration-200 hover:text-ink"
              >
                <span className="text-[16px] font-medium text-ink/90">{faq.q}</span>
                <motion.span
                  animate={openIndex === i ? { rotate: 90 } : { rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02]"
                >
                  {openIndex === i ? (
                    <Minus size={12} className="text-primary" />
                  ) : (
                    <Plus size={12} className="text-ink-subtle" />
                  )}
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={springTransition}
                    className="overflow-hidden"
                  >
                    <motion.p
                      initial={{ y: -8, filter: "blur(2px)" }}
                      animate={{ y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="pb-6 text-[14px] leading-relaxed text-ink-muted"
                    >
                      {faq.a}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto mt-12 max-w-lg text-center"
        >
          <p className="text-[14px] text-ink-muted">
            Still have questions?{" "}
            <a href="#" className="text-primary hover:text-primary-hover transition-colors font-medium">
              Contact our team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
