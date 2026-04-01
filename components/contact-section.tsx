"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
      <section id="contact" className="bg-[#0A0A0A] py-36 px-8 overflow-hidden gpu">
        <div className="max-w-[1400px] mx-auto">

          {/* ── HEADER ── */}
          <div className="mb-20">
            <motion.span
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="label !text-[#444] mb-5 block"
            >
              Let's Connect
            </motion.span>
            <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(3rem,7vw,7rem)] leading-[0.93] tracking-[-0.03em] text-white gpu"
                style={{ fontFamily: "var(--font-serif)" }}
            >
              Have a<br />
              <span style={{ fontStyle: "italic", color: "rgba(200,219,201,0.5)" }}>Vision?</span>
            </motion.h2>
          </div>

          {/* ── TWO COL ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[28px] overflow-hidden border border-white/5">

            {/* LEFT: INFO */}
            <div className="bg-white/[0.03] p-14 flex flex-col justify-between gap-16 border-r border-white/5">
              <div>
                <p className="text-[15px] text-[#666] leading-relaxed max-w-sm">
                  Ready to elevate your digital presence? Reach out and
                  let's build something exceptional together.
                </p>
              </div>

              <div className="flex flex-col gap-10">
                <div>
                  <span className="label !text-[#333] mb-3 block">Email Us</span>
                  <a
                      href="mailto:hello@alhambra.web"
                      className="text-[22px] font-medium text-white hover:text-[#C8DBC9] transition-colors"
                      style={{ fontFamily: "var(--font-serif)" }}
                  >
                    hello@alhambra.web
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <span className="label !text-[#333] mb-3 block">Location</span>
                    <span className="text-[15px] font-medium text-white">Paris / Remote</span>
                  </div>
                  <div>
                    <span className="label !text-[#333] mb-3 block">Social</span>
                    <a href="#" className="text-[15px] font-medium text-white underline decoration-[#C8DBC9] underline-offset-4 hover:text-[#C8DBC9] transition-colors">
                      LinkedIn
                    </a>
                  </div>
                </div>

                {/* Avatar stack */}
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map((n) => (
                        <img key={n} src={`https://i.pravatar.cc/40?img=${n+5}`} className="w-9 h-9 rounded-full border-2 border-[#0A0A0A]" alt="" />
                    ))}
                  </div>
                  <p className="text-[13px] text-[#555]">
                    Trusted by <span className="text-white font-medium">48+</span> clients worldwide
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: FORM */}
            <div className="bg-white p-14 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {submitted ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16"
                    >
                      <div className="w-20 h-20 bg-[#C8DBC9] rounded-full flex items-center justify-center text-3xl mx-auto mb-8">
                        ✓
                      </div>
                      <h3
                          className="text-[2rem] tracking-tight mb-3"
                          style={{ fontFamily: "var(--font-serif)" }}
                      >
                        Message Received
                      </h3>
                      <p className="text-[14px] text-[#9A9A9A]">We'll get back to you within 24 hours.</p>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full max-w-md space-y-10"
                    >
                      {[
                        { label: "Full Name", type: "text", placeholder: "John Doe" },
                        { label: "Email Address", type: "email", placeholder: "john@example.com" }
                      ].map((field) => (
                          <div key={field.label} className="space-y-2">
                            <label className="label">{field.label}</label>
                            <input
                                required
                                type={field.type}
                                placeholder={field.placeholder}
                                className="input-underline"
                            />
                          </div>
                      ))}

                      <div className="space-y-2">
                        <label className="label">Message</label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Tell us about your project..."
                            className="input-underline resize-none"
                        />
                      </div>

                      <button type="submit" className="btn-pill w-full justify-center py-5 group">
                        Send Message{" "}
                        <span className="group-hover:translate-x-2 transition-transform inline-block">→</span>
                      </button>
                    </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
  );
}