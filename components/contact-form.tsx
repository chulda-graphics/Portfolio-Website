"use client";

import { FormEvent, useRef, useState } from "react";
import { BookingButton } from "./booking-button";

type FormStatus = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    try {
      const payload = new FormData(event.currentTarget);
      payload.set("_url", window.location.href);
      const response = await fetch(
        "https://formsubmit.co/ajax/chulda.graphics2022@gmail.com",
        {
          method: "POST",
          headers: { Accept: "application/json" },
          body: payload,
        },
      );
      if (!response.ok) throw new Error("The message could not be sent.");
      form.current?.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="contact-workspace" aria-labelledby="contact-form-title">
      <div className="contact-form-intro">
        <p className="eyebrow">Start a project</p>
        <h2 id="contact-form-title">Tell me what needs to become clear.</h2>
        <p>
          Share the product, the audience, and where motion needs to do more work.
          I&apos;ll reply with the most useful next step.
        </p>
        <BookingButton className="text-button" data-cursor="Book">
          Prefer a conversation? Schedule a call <span aria-hidden="true">↗</span>
        </BookingButton>
      </div>

      <form ref={form} className="contact-form" onSubmit={submit}>
        <input type="hidden" name="_subject" value="New portfolio project inquiry" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
        <input
          type="text"
          name="_honey"
          className="form-honeypot"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="form-field">
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="form-field">
          <label htmlFor="email">Work email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="form-field">
          <label htmlFor="company">Company / product</label>
          <input id="company" name="company" type="text" autoComplete="organization" required />
        </div>
        <div className="form-field">
          <label htmlFor="project">What are you looking for?</label>
          <select id="project" name="project" defaultValue="" required>
            <option value="" disabled>Select a project type</option>
            <option>Product launch film</option>
            <option>UI / product motion</option>
            <option>SaaS video editing</option>
            <option>Motion design system</option>
            <option>Not sure yet</option>
          </select>
        </div>
        <div className="form-field form-field-wide">
          <label htmlFor="message">What should people understand or feel?</label>
          <textarea id="message" name="message" rows={5} required />
        </div>

        <div className="form-submit">
          <p role="status" aria-live="polite">
            {status === "sent" && "Message sent. I’ll reply as soon as I can."}
            {status === "error" && "Something interrupted the send. Please try again or email me directly."}
          </p>
          <button type="submit" disabled={status === "sending"} data-cursor="Send">
            {status === "sending" ? "Sending…" : status === "sent" ? "Send another inquiry" : "Send inquiry"}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </form>
    </section>
  );
}
