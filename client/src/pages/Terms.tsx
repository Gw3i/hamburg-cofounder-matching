import { DotGridBackground } from '@/components/DotGridBackground';
import { APP_TITLE } from '@/const';
import { LogoIcon } from '@/components/LogoIcon';
import { Link } from 'wouter';

export default function Terms() {
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
            <h1 className="text-3xl font-bold lowercase mb-8">terms of service</h1>
            
            <p className="lowercase mb-4">
              last updated: november 25, 2025
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">1. acceptance of terms</h2>
            <p className="lowercase mb-4">
              by accessing and using hamburg co-founder platform ("the service"), you accept and agree to be bound by these terms of service and our privacy policy. if you do not agree to these terms, please do not use our service.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">2. description of service</h2>
            <p className="lowercase mb-4">
              hamburg co-founder platform is a service that connects founders in hamburg who are looking for co-founders. we provide a platform for you to create a profile, browse other founders' profiles, and potentially connect with suitable co-founders.
            </p>
            <p className="lowercase mb-4">
              the service is provided free of charge. we do not guarantee that you will find a suitable co-founder, and we are not responsible for the outcome of any connections made through our platform.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">3. eligibility</h2>
            <p className="lowercase mb-4">
              you must be at least 18 years old to use this service. by creating an account, you represent and warrant that:
            </p>
            <ul className="lowercase mb-4 list-disc pl-6">
              <li>you are at least 18 years of age</li>
              <li>you have the legal capacity to enter into these terms</li>
              <li>you are not prohibited from using the service under applicable law</li>
              <li>all information you provide is accurate and truthful</li>
            </ul>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">4. user accounts</h2>
            <p className="lowercase mb-4">
              to use our service, you must create an account using manus oauth authentication. you are responsible for:
            </p>
            <ul className="lowercase mb-4 list-disc pl-6">
              <li>maintaining the confidentiality of your account credentials</li>
              <li>all activities that occur under your account</li>
              <li>ensuring the accuracy and completeness of information you provide</li>
              <li>notifying us immediately of any unauthorized use of your account</li>
              <li>updating your profile information to keep it current</li>
            </ul>
            <p className="lowercase mb-4">
              you may not create multiple accounts or share your account with others.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">5. user conduct</h2>
            <p className="lowercase mb-4">
              you agree not to:
            </p>
            <ul className="lowercase mb-4 list-disc pl-6">
              <li>post false, misleading, or fraudulent information on your profile</li>
              <li>harass, abuse, threaten, or harm other users</li>
              <li>use the service for any illegal purpose or to violate any laws</li>
              <li>attempt to gain unauthorized access to our systems or other users' accounts</li>
              <li>spam, send unsolicited messages, or engage in commercial solicitation</li>
              <li>impersonate another person or entity</li>
              <li>upload malicious code, viruses, or harmful content</li>
              <li>scrape, copy, or automatically collect data from the platform</li>
              <li>use the service to recruit for multi-level marketing or pyramid schemes</li>
              <li>discriminate against others based on protected characteristics</li>
            </ul>
            <p className="lowercase mb-4">
              violation of these rules may result in immediate account termination.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">6. profile content and visibility</h2>
            <p className="lowercase mb-4">
              by creating a profile, you understand and agree that:
            </p>
            <ul className="lowercase mb-4 list-disc pl-6">
              <li>your profile information will be publicly visible to all registered users</li>
              <li>your "last active" timestamp will be displayed to other users</li>
              <li>you retain ownership of the content you post</li>
              <li>you grant us a non-exclusive, worldwide license to display and distribute your content on our service</li>
              <li>you are responsible for the accuracy of your profile information</li>
            </ul>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">7. intellectual property</h2>
            <p className="lowercase mb-4">
              the service, including its design, features, and functionality, is owned by hamburg co-founder platform and is protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="lowercase mb-4">
              you may not copy, modify, distribute, sell, or lease any part of our service without our prior written permission.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">8. disclaimer of warranties</h2>
            <p className="lowercase mb-4">
              our service is provided "as is" and "as available" without warranties of any kind, either express or implied. we do not guarantee that:
            </p>
            <ul className="lowercase mb-4 list-disc pl-6">
              <li>the service will be uninterrupted, secure, or error-free</li>
              <li>you will find a suitable co-founder through the platform</li>
              <li>other users' information is accurate, reliable, or complete</li>
              <li>the service will meet your specific requirements or expectations</li>
              <li>any defects or errors will be corrected</li>
            </ul>
            <p className="lowercase mb-4">
              you use the service at your own risk. we are not responsible for verifying the identity or background of users.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">9. limitation of liability</h2>
            <p className="lowercase mb-4">
              to the maximum extent permitted by law, hamburg co-founder platform, its operators, and affiliates shall not be liable for:
            </p>
            <ul className="lowercase mb-4 list-disc pl-6">
              <li>any indirect, incidental, special, consequential, or punitive damages</li>
              <li>loss of profits, revenue, data, or business opportunities</li>
              <li>damages arising from your interactions with other users</li>
              <li>damages resulting from unauthorized access to your account</li>
              <li>any content posted by users on the platform</li>
            </ul>
            <p className="lowercase mb-4">
              our total liability to you for any claims arising from your use of the service shall not exceed €100.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">10. indemnification</h2>
            <p className="lowercase mb-4">
              you agree to indemnify and hold harmless hamburg co-founder platform from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
            </p>
            <ul className="lowercase mb-4 list-disc pl-6">
              <li>your use of the service</li>
              <li>your violation of these terms</li>
              <li>your violation of any rights of another user</li>
              <li>content you post on your profile</li>
            </ul>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">11. termination</h2>
            <p className="lowercase mb-4">
              we reserve the right to suspend or terminate your account at any time for any reason, including:
            </p>
            <ul className="lowercase mb-4 list-disc pl-6">
              <li>violation of these terms</li>
              <li>fraudulent or illegal activity</li>
              <li>prolonged inactivity</li>
              <li>at our sole discretion</li>
            </ul>
            <p className="lowercase mb-4">
              you may delete your account at any time through your profile settings. upon termination, your profile will be removed from public view and your data will be deleted in accordance with our privacy policy.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">12. changes to terms</h2>
            <p className="lowercase mb-4">
              we may modify these terms at any time. we will notify you of material changes by updating the "last updated" date at the top of this page. continued use of the service after changes constitutes your acceptance of the modified terms.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">13. governing law and jurisdiction</h2>
            <p className="lowercase mb-4">
              these terms are governed by the laws of the federal republic of germany, without regard to its conflict of law provisions. any disputes arising from these terms or your use of the service shall be resolved exclusively in the courts of hamburg, germany.
            </p>
            <p className="lowercase mb-4">
              if you are a consumer residing in the european union, you also have the right to bring proceedings in the courts of your country of residence.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">14. severability</h2>
            <p className="lowercase mb-4">
              if any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">15. entire agreement</h2>
            <p className="lowercase mb-4">
              these terms, together with our privacy policy, constitute the entire agreement between you and hamburg co-founder platform regarding your use of the service.
            </p>

            <h2 className="text-xl font-semibold lowercase mt-8 mb-4">16. contact</h2>
            <p className="lowercase mb-4">
              if you have questions about these terms, please contact us at:<br />
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
