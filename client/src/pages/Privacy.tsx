import { DotGridBackground } from '@/components/DotGridBackground';
import { APP_TITLE } from '@/const';
import { LogoIcon } from '@/components/LogoIcon';
import { Link } from 'wouter';

export default function Privacy() {
  return (
    <>
      <DotGridBackground />
      
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="container py-6 flex items-center justify-between border-b">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <LogoIcon className="h-8 w-8" />
              <span className="font-semibold lowercase">{APP_TITLE.toLowerCase()}</span>
            </div>
          </Link>
        </header>

        {/* Main Content */}
        <main className="container py-12 flex-1 max-w-3xl">
          <div className="prose prose-sm max-w-none">
            <h1 className="text-3xl font-bold lowercase mb-8">privacy policy</h1>
            
            <p className="lowercase mb-4">
              last updated: november 25, 2025
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">1. data controller</h2>
            <p className="lowercase mb-4">
              the data controller responsible for your personal data is:
            </p>
            <p className="lowercase mb-4">
              vladyslav nyzhashchyy<br />
              email: v.nyzhashchyy@gmail.com<br />
              location: hamburg, germany
            </p>
            <p className="lowercase mb-4">
              for any questions regarding data protection, please contact us at the email address above.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">2. information we collect</h2>
            <p className="lowercase mb-4">
              we collect information you provide directly to us when you create an account and profile:
            </p>
            <ul className="lowercase mb-4 list-disc pl-6">
              <li>authentication data: email address (via supabase auth)</li>
              <li>profile information: name, age, current occupation, time commitment</li>
              <li>founder attributes: technical skills, idea status, skill areas</li>
              <li>description fields: your idea, what you're looking for, specific skills</li>
              <li>optional data: linkedin profile url, profile photo</li>
              <li>usage data: last active timestamp</li>
            </ul>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">3. legal basis for processing</h2>
            <p className="lowercase mb-4">
              we process your personal data based on the following legal grounds under gdpr:
            </p>
            <ul className="lowercase mb-4 list-disc pl-6">
              <li><strong>consent (art. 6(1)(a) gdpr):</strong> you provide explicit consent when creating your profile and making it publicly visible to other founders</li>
              <li><strong>contract performance (art. 6(1)(b) gdpr):</strong> processing is necessary to provide the co-founder matching service you requested</li>
              <li><strong>legitimate interests (art. 6(1)(f) gdpr):</strong> maintaining platform security and preventing fraud</li>
            </ul>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">4. how we use your information</h2>
            <p className="lowercase mb-4">
              we use the information we collect to:
            </p>
            <ul className="lowercase mb-4 list-disc pl-6">
              <li>provide, maintain, and improve our co-founder matching service</li>
              <li>enable you to create a profile and browse other founders</li>
              <li>display your profile publicly to other registered users</li>
              <li>show when you were last active on the platform</li>
              <li>communicate with you about the service (if needed)</li>
              <li>ensure the security and integrity of our platform</li>
            </ul>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">5. data storage and third-party processors</h2>
            <p className="lowercase mb-4">
              your data is processed and stored by the following third-party service providers:
            </p>
            <ul className="lowercase mb-4 list-disc pl-6">
              <li><strong>supabase (supabase inc.):</strong> authentication, database, and file storage for all user data including profiles, photos, and login credentials. data is stored in eu servers (ireland). supabase is gdpr-compliant and has appropriate data processing agreements in place.</li>
            </ul>
            <p className="lowercase mb-4">
              all third-party processors are contractually obligated to protect your data in accordance with gdpr requirements.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">6. data security</h2>
            <p className="lowercase mb-4">
              we implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction, including:
            </p>
            <ul className="lowercase mb-4 list-disc pl-6">
              <li>encrypted data transmission (https/tls)</li>
              <li>secure authentication via supabase auth</li>
              <li>access controls and authentication requirements</li>
              <li>regular security assessments</li>
            </ul>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">7. your rights under gdpr</h2>
            <p className="lowercase mb-4">
              under the general data protection regulation (gdpr), you have the following rights:
            </p>
            <ul className="lowercase mb-4 list-disc pl-6">
              <li><strong>right of access (art. 15 gdpr):</strong> request a copy of your personal data</li>
              <li><strong>right to rectification (art. 16 gdpr):</strong> correct inaccurate data via your profile page</li>
              <li><strong>right to erasure (art. 17 gdpr):</strong> request deletion of your account and all associated data</li>
              <li><strong>right to restrict processing (art. 18 gdpr):</strong> limit how we process your data</li>
              <li><strong>right to data portability (art. 20 gdpr):</strong> receive your data in a structured, machine-readable format</li>
              <li><strong>right to object (art. 21 gdpr):</strong> object to processing based on legitimate interests</li>
              <li><strong>right to withdraw consent (art. 7(3) gdpr):</strong> withdraw your consent at any time by deleting your account</li>
            </ul>
            <p className="lowercase mb-4">
              to exercise any of these rights, please contact us at v.nyzhashchyy@gmail.com. we will respond to your request within one month.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">8. cookies and tracking</h2>
            <p className="lowercase mb-4">
              we use session storage (not cookies) for authentication purposes only. we do not use tracking cookies or third-party analytics. no consent banner is required as we do not use non-essential cookies.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">9. data retention</h2>
            <p className="lowercase mb-4">
              we retain your personal information for as long as your account is active. if you delete your account, we will:
            </p>
            <ul className="lowercase mb-4 list-disc pl-6">
              <li>immediately remove your profile from public view</li>
              <li>permanently delete your personal data within 30 days</li>
              <li>retain only anonymized usage statistics for service improvement</li>
            </ul>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">10. international data transfers</h2>
            <p className="lowercase mb-4">
              your data is primarily stored within the european union (ireland via supabase). any transfers outside the eu are protected by appropriate safeguards such as standard contractual clauses approved by the european commission.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">11. automated decision-making</h2>
            <p className="lowercase mb-4">
              we do not use automated decision-making or profiling that produces legal effects or similarly significantly affects you.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">12. children's privacy</h2>
            <p className="lowercase mb-4">
              our service is not intended for users under 18 years of age. we do not knowingly collect personal information from children. if you are under 18, please do not use this service.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">13. right to lodge a complaint</h2>
            <p className="lowercase mb-4">
              if you believe we have not handled your personal data in accordance with gdpr, you have the right to lodge a complaint with a supervisory authority:
            </p>
            <p className="lowercase mb-4">
              for germany: der hamburgische beauftragte für datenschutz und informationsfreiheit<br />
              website: datenschutz-hamburg.de
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">14. changes to this policy</h2>
            <p className="lowercase mb-4">
              we may update this privacy policy from time to time. we will notify you of any material changes by posting the new policy on this page with an updated "last updated" date. continued use of the service after changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">15. contact us</h2>
            <p className="lowercase mb-4">
              if you have any questions about this privacy policy or wish to exercise your gdpr rights, please contact us at:<br />
              email: v.nyzhashchyy@gmail.com
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="container py-6 border-t">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground lowercase">
              privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground lowercase">
              terms
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}
