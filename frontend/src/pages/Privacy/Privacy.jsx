const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
      <h1 className="font-display text-3xl mb-2">Privacy Policy</h1>
      <p className="text-[#6B4F4F] mb-10 text-sm">Last updated: [add the date you publish this]</p>

      <div className="space-y-8 text-sm leading-relaxed text-[#0F0F0F]/90">
        <section>
          <h2 className="font-display text-xl mb-2">1. Information We Collect</h2>
          <p>
            When you create an account, place an order, or contact us, we collect information such
            as your name, email address, phone number, delivery address, and order history. Payment
            details are processed directly by Paystack — we never store your card information on
            our servers.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-2">2. How We Use Your Information</h2>
          <p>
            We use your information to process orders, communicate order updates, respond to
            support requests, and — if you've opted in — send promotional offers. You can control
            these email preferences at any time from your account dashboard.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-2">3. How We Protect Your Information</h2>
          <p>
            Passwords are encrypted and never stored in plain text. Access to your personal data is
            limited to what's needed to fulfill your orders and provide support.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-2">4. Third-Party Services</h2>
          <p>
            We use Paystack for payment processing and Cloudinary for image hosting. These services
            have their own privacy policies governing how they handle data passed to them.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-2">5. Your Rights</h2>
          <p>
            You can update your personal details, change your password, adjust your notification
            preferences, or permanently delete your account at any time from your Dashboard's
            Profile tab.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-2">6. Contact Us</h2>
          <p>
            Questions about this policy? Reach out at{" "}
            <a href="mailto:hello@bdivashair.com" className="text-[#D4AF37] underline">
              hello@bdivashair.com
            </a>
            .
          </p>
        </section>
      </div>

      <p className="text-xs text-[#6B4F4F] mt-12 border-t border-[#F7E7CE] pt-6">
        Note: this is a starting template, not legal advice. Consider having a lawyer review this
        before relying on it for a live business, especially around Nigerian data protection
        requirements (NDPR).
      </p>
    </div>
  );
};

export default Privacy;