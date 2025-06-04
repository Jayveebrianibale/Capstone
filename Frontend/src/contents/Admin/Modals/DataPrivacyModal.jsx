import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

function DataPrivacyModal({ isOpen, onAccept }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 md:p-8">
              <div className="mb-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[#1F3463] mb-2">
                  PROFILE SETUP COMPLETE!
                </h2>
                <p className="text-lg font-medium text-gray-700">
                  Your profile was successfully set up.
                </p>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700 mb-6">
                <p className="text-justify mb-4">
                  In compliance with data privacy laws, such as, but not limited to, Republic Act No. 10173 (Philippine Data Privacy Act of 2012) and implementing rules and regulations, we within the Organization of La Verdad Christian College, Inc. (LVCC), collect and process your personal information in this form is for the purpose of collecting official list of class officers only, keeping them securely and with confidentiality using our organizational, technical, and physical security measures, and retain them in accordance with our Retention Policy.
                </p>

                <p className="text-justify mb-4">
                  We don't share them to any external group without your consent, unless otherwise stated in our Privacy Notice. You have the right to be informed, to object, to access, to rectify, to erase or to block the processing of your personal information, as well as your right to data portability, to file a complaint and be entitled to damages for violation of your rights under this data privacy.
                </p>

                <p className="text-justify mb-4 font-semibold">
                  For your data privacy inquiries, you may reach our Data Protection Officer through:<br />
                  Email: <a href="mailto:dpo@laverdad.edu.ph" className="text-[#1F3463]">dpo@laverdad.edu.ph</a>
                </p>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      id="privacyConsent" 
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                      className="mt-1 mr-2 h-4 w-4 text-[#1F3463] focus:ring-[#1F3463] border-gray-300 rounded"
                    />
                    <label htmlFor="privacyConsent" className="text-sm text-gray-600">
                      By ticking "I Agree", I voluntarily give my consent to LVCC to collect, process, record, use, and retain my personal information for the above-mentioned purpose, in accordance with this Privacy Notice.
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
                <button
                  onClick={onAccept}
                  disabled={!accepted}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    accepted
                      ? "bg-[#1F3463] hover:bg-[#15294e] text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continue to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default DataPrivacyModal;  