import React, { useState } from 'react';
import { SITE } from '../config/siteConfig.js';
import { submitContact } from '../services/publicService.js';
import { useLang } from '../i18n/LanguageContext.jsx';

function InfoCard({ icon, title, children }) {
  return (
    <div className="card flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center
                      text-primary-700 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-heading font-semibold text-primary-900 text-sm mb-1">{title}</h3>
        <div className="text-sm text-gray-500 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const { t } = useLang();
  const [form, setForm]     = useState({ name:'', email:'', mobile:'', subject:'', message:'' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading'); setErrMsg('');
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name:'', email:'', mobile:'', subject:'', message:'' });
    } catch (err) {
      setStatus('error');
      setErrMsg(err.message || t('common.error'));
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-800 py-12 sm:py-16">
        <div className="container-xl text-center">
          <div className="eyebrow-white mx-auto mb-4">{t('nav.contact')}</div>
          <h1 className="heading-lg text-white mb-3">{t('contact.heading')}</h1>
          <p className="text-blue-200 max-w-lg mx-auto">{t('contact.subheading')}</p>
        </div>
      </div>

      <div className="container-xl py-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Info sidebar */}
          <div className="space-y-4">
            <InfoCard
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>}
              title={t('contact.address')}
            >
              {SITE.address.line1},<br/>
              {SITE.address.line2},<br/>
              {SITE.address.state} – {SITE.address.pin}
            </InfoCard>

            <InfoCard
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>}
              title={t('contact.phone')}
            >
              <a href={`tel:${SITE.phone}`} className="hover:text-primary-700 transition-colors font-medium">
                {SITE.phone}
              </a>
            </InfoCard>

            <InfoCard
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>}
              title="Email"
            >
              <a href={`mailto:${SITE.email}`} className="hover:text-primary-700 transition-colors font-medium">
                {SITE.email}
              </a>
            </InfoCard>

            {SITE.social.whatsapp && (
              <InfoCard
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>}
                title={t('contact.whatsapp')}
              >
                <a href={`https://wa.me/${SITE.social.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="hover:text-primary-700 transition-colors font-medium">
                  +{SITE.social.whatsapp}
                </a>
              </InfoCard>
            )}

            {/* Hours */}
            <div className="card bg-primary-50 border-primary-100">
              <h3 className="font-heading font-semibold text-primary-900 text-sm mb-3">Office Hours</h3>
              <div className="space-y-1.5 text-xs text-primary-700">
                <div className="flex justify-between">
                  <span>Monday – Saturday</span>
                  <span className="font-semibold">9:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="heading-sm text-primary-900 mb-6">Send Us a Message</h2>

              {status === 'success' ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-trust-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-trust-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-primary-900 text-lg mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-sm mb-5">{t('contact.success')}</p>
                  <button onClick={() => setStatus('idle')} className="btn-outline text-sm">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {status === 'error' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                      {errMsg}
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label label-req" htmlFor="c-name">{t('contact.name')}</label>
                      <input id="c-name" type="text" required className="input"
                        value={form.name} onChange={e => set('name', e.target.value)}
                        placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="label label-req" htmlFor="c-email">{t('contact.email')}</label>
                      <input id="c-email" type="email" required className="input"
                        value={form.email} onChange={e => set('email', e.target.value)}
                        placeholder="you@example.com" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label" htmlFor="c-mobile">{t('contact.mobile')}</label>
                      <input id="c-mobile" type="tel" className="input"
                        value={form.mobile} onChange={e => set('mobile', e.target.value)}
                        placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <div>
                      <label className="label label-req" htmlFor="c-subject">{t('contact.subject')}</label>
                      <input id="c-subject" type="text" required className="input"
                        value={form.subject} onChange={e => set('subject', e.target.value)}
                        placeholder="What is this about?" />
                    </div>
                  </div>
                  <div>
                    <label className="label label-req" htmlFor="c-message">{t('contact.message')}</label>
                    <textarea id="c-message" required rows={5} className="input resize-none"
                      value={form.message} onChange={e => set('message', e.target.value)}
                      placeholder="Tell us how we can help..." />
                  </div>
                  <button type="submit" disabled={status === 'loading'}
                    className="btn-primary w-full sm:w-auto disabled:opacity-60">
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        {t('contact.sending')}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                        </svg>
                        {t('contact.send')}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
