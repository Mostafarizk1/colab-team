'use client';

import { useState } from 'react';
import { translations, Language } from '@/lib/translations';
import { countries } from '@/lib/countries';

export default function Home() {
  const [lang, setLang] = useState<Language>('ar');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    professions: [] as string[],
    skill: '',
    portfolio1: '',
    portfolio2: '',
    experience: '',
    phone: '',
    email: '',
    country: '',
  });

  const t = translations[lang];
  const isRTL = lang === 'ar';

  const handleProfessionChange = (profession: string) => {
    setFormData(prev => ({
      ...prev,
      professions: prev.professions.includes(profession)
        ? prev.professions.filter(p => p !== profession)
        : [...prev.professions, profession]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit');
      
      setIsSuccess(true);
      setFormData({
        name: '',
        professions: [],
        skill: '',
        portfolio1: '',
        portfolio2: '',
        experience: '',
        phone: '',
        email: '',
        country: '',
      });
    } catch {
      setError(t.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.successTitle}</h2>
          <p className="text-gray-600">{t.successMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">{t.siteName}</h1>
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {t.switchLang}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{t.heroTitle}</h2>
          <p className="text-xl text-gray-600 mb-6">{t.heroSubtitle}</p>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{t.heroDescription}</p>
        </section>

        {/* Idea Section */}
        <section className="mb-16 bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.ideaTitle}</h3>
          <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">{t.ideaText}</p>
          
          <ul className="space-y-3 mb-6">
            {t.ideaPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-gray-600">{point}</span>
              </li>
            ))}
          </ul>
          
          <p className="text-gray-700 font-medium whitespace-pre-line">{t.ideaFooter}</p>
        </section>

        {/* Form Section */}
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{t.formTitle}</h3>
          <p className="text-gray-600 mb-8">{t.formSubtitle}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.nameLabel} *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t.namePlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Professions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t.professionsLabel} *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(t.professions).map(([key, value]) => (
                  <label
                    key={key}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.professions.includes(key)
                        ? 'border-gray-800 bg-gray-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.professions.includes(key)}
                      onChange={() => handleProfessionChange(key)}
                      className="w-5 h-5 text-gray-800 rounded focus:ring-gray-800"
                    />
                    <span className="text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Skill */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.skillLabel} *</label>
              <textarea
                required
                value={formData.skill}
                onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                placeholder={t.skillPlaceholder}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            {/* Portfolio Notice */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm font-medium mb-1">{t.portfolioNoticeTitle}</p>
              <p className="text-amber-700 text-sm">{t.portfolioNoticeText}</p>
            </div>

            {/* Portfolio Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.portfolio1Label} *</label>
                <input
                  type="text"
                  required
                  value={formData.portfolio1}
                  onChange={(e) => setFormData({ ...formData, portfolio1: e.target.value })}
                  placeholder={t.portfolio1Placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.portfolio2Label}</label>
                <input
                  type="text"
                  value={formData.portfolio2}
                  onChange={(e) => setFormData({ ...formData, portfolio2: e.target.value })}
                  placeholder={t.portfolio2Placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Experience & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.experienceLabel} *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="50"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder={t.experiencePlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.phoneLabel} *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t.phonePlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Email & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.emailLabel} *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t.emailPlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.countryLabel} *</label>
                <select
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="">{t.countryPlaceholder}</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {lang === 'ar' ? country.nameAr : country.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || formData.professions.length === 0}
              className="w-full py-4 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              {isSubmitting ? t.submitting : t.submitButton}
            </button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-600">
          {t.footerText}
        </div>
      </footer>
    </div>
  );
}
