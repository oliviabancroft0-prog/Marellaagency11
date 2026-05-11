import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Camera, 
  Shield, 
  Wallet, 
  FileText, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { insforge } from '../../lib/insforge';
import { useAuth } from '../../context/AuthContext';

const STEPS = [
  { id: 'identity', title: 'Stage Identity', icon: User },
  { id: 'visuals', title: 'Visual Portfolio', icon: Camera },
  { id: 'security', title: 'Verification', icon: Shield },
  { id: 'financials', title: 'Settlement', icon: Wallet },
  { id: 'agreement', title: 'Agency Terms', icon: FileText }
];

export const CreatorOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    stageName: '',
    bio: '',
    photos: [] as { file: File, preview: string }[],
    idFile: null as { file: File, preview: string } | null,
    idVerified: false,
    ageVerified: false,
    payoutProvider: 'bank' as 'bank' | 'paypal',
    payoutDetails: '',
    termsAccepted: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, refreshAuth } = useAuth();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Note: Real file upload would go here to a storage bucket
      // For now, we store metadata and clean full_name

      // 1. Try to update DB with full details.
      const { error: fullUpdateError } = await insforge.database
        .from('users')
        .update({
          full_name: formData.stageName,
          creator_profile: {
            stage_name: formData.stageName,
            bio: formData.bio,
            payout_provider: formData.payoutProvider,
            payout_details: formData.payoutDetails,
            // Store number of photos uploaded and verification status
            photos_count: formData.photos.length,
            id_verification_pending: !!formData.idFile,
          },
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      // If full update failed, try a minimal update as a fallback
      if (fullUpdateError) {
        const isColumnError = fullUpdateError.message.includes('column') || 
                             fullUpdateError.message.includes('creator_profile') ||
                             fullUpdateError.message.includes('onboarding_completed');
        
        if (isColumnError) {
          console.warn('Specialized database columns missing, using full_name fallback for status.');
        } else {
          console.error('Error during full onboarding update:', fullUpdateError.message);
        }
        
        // Final fallback: just update full_name to remove the PENDING prefixes
        const { error: fallbackError } = await insforge.database
          .from('users')
          .update({
            full_name: formData.stageName,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (fallbackError) {
          console.error('Critical failure: Fallback onboarding update failed:', fallbackError.message);
          return;
        }
      }

      await refreshAuth();
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (STEPS[currentStep].id) {
      case 'identity': return formData.stageName.length > 2 && formData.bio.length > 10;
      case 'visuals': return formData.photos.length >= 4;
      case 'security': return formData.idFile !== null && formData.ageVerified;
      case 'financials': return formData.payoutDetails.length > 5;
      case 'agreement': return formData.termsAccepted;
      default: return false;
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos = Array.from(files).map((file: File) => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos].slice(0, 8) // Limit to 8
    }));
  };

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData(prev => ({
      ...prev,
      idFile: {
        file,
        preview: URL.createObjectURL(file as Blob)
      }
    }));
  };

  return (
    <div className="min-h-screen bg-brand-offwhite pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-serif italic">Creator Onboarding</h1>
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-black/40">Step {currentStep + 1} of {STEPS.length}</span>
          </div>
          <div className="flex space-x-2">
            {STEPS.map((step, i) => (
              <div 
                key={step.id}
                className={`h-1 flex-1 transition-all duration-500 rounded-full ${i <= currentStep ? 'bg-brand-black' : 'bg-brand-border'}`}
              />
            ))}
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white border border-brand-border p-10 rounded-sm shadow-sm"
        >
          {currentStep === 0 && (
            <div className="space-y-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-brand-offwhite text-brand-black rounded-full">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-serif italic">Define Your Identity</h2>
                  <p className="text-[10px] uppercase tracking-widest text-brand-black/40">This is how the registry will identify you.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-black/60">Stage Name</label>
                  <input
                    type="text"
                    value={formData.stageName}
                    onChange={(e) => setFormData(p => ({...p, stageName: e.target.value}))}
                    className="w-full px-4 py-3 bg-brand-offwhite border border-brand-border focus:outline-none focus:border-brand-black text-sm transition-colors"
                    placeholder="e.g. Silk London"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-black/60">Bio / Persona Description</label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData(p => ({...p, bio: e.target.value}))}
                    className="w-full px-4 py-3 bg-brand-offwhite border border-brand-border focus:outline-none focus:border-brand-black text-sm transition-colors resize-none"
                    placeholder="Detail your digital signature..."
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-brand-offwhite text-brand-black rounded-full">
                  <Camera size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-serif italic">Visual Portfolio</h2>
                  <p className="text-[10px] uppercase tracking-widest text-brand-black/40">Upload initial assets for agency review.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {formData.photos.map((photo, i) => (
                  <div key={i} className="relative aspect-[3/4] bg-brand-offwhite border border-brand-border overflow-hidden rounded-sm group">
                    <img src={photo.preview} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setFormData(p => ({...p, photos: p.photos.filter((_, idx) => idx !== i)}))}
                      className="absolute top-2 right-2 p-1.5 bg-brand-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Check size={12} className="rotate-45" /> {/* Use as close mark */}
                    </button>
                  </div>
                ))}
                
                {formData.photos.length < 8 && (
                  <label className="aspect-[3/4] bg-brand-offwhite border-2 border-dashed border-brand-border flex flex-col items-center justify-center group cursor-pointer hover:border-brand-black transition-colors rounded-sm">
                    <Camera size={24} className="text-brand-black/20 group-hover:text-brand-black transition-colors mb-2" />
                    <span className="text-[9px] uppercase tracking-widest font-bold text-brand-black/30">Upload Asset</span>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoUpload}
                    />
                  </label>
                )}
              </div>
              <p className="text-[10px] text-center italic text-brand-black/40">Minimum 4 professional/clear shots required for baseline assessment.</p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-brand-offwhite text-brand-black rounded-full">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-serif italic">Verification Gate</h2>
                  <p className="text-[10px] uppercase tracking-widest text-brand-black/40">Security and safety is paramount to our network.</p>
                </div>
              </div>

              <div className="space-y-4">
                <label 
                  className={`p-6 border rounded-sm cursor-pointer transition-all flex items-center justify-between group ${formData.idFile ? 'border-brand-black bg-brand-offwhite' : 'border-brand-border bg-white hover:border-brand-black/40'}`}
                >
                  <div className="flex items-center space-x-4">
                    <Check size={18} className={formData.idFile ? 'text-brand-black' : 'text-brand-black/10'} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Government Issued ID</span>
                      <span className="text-[9px] uppercase tracking-widest text-brand-black/40">{formData.idFile ? formData.idFile.file.name : 'Upload Passport/Driving Licence'}</span>
                    </div>
                  </div>
                  {formData.idFile ? (
                    <div className="flex items-center space-x-2">
                       {formData.idFile.preview && <img src={formData.idFile.preview} className="w-8 h-8 object-cover rounded-sm border border-brand-border" />}
                       <ShieldCheck size={18} className="text-green-600" />
                    </div>
                  ) : (
                    <ArrowRight size={16} className="text-brand-black/20 group-hover:text-brand-black group-hover:translate-x-1 transition-all" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    className="hidden" 
                    onChange={handleIdUpload}
                  />
                </label>

                <div 
                  onClick={() => setFormData(p => ({...p, ageVerified: !p.ageVerified}))}
                  className={`p-6 border rounded-sm cursor-pointer transition-all flex items-center justify-between ${formData.ageVerified ? 'border-brand-black bg-brand-offwhite' : 'border-brand-border bg-white hover:border-brand-black/40'}`}
                >
                  <div className="flex items-center space-x-4">
                    <Check size={18} className={formData.ageVerified ? 'text-brand-black' : 'text-brand-black/10'} />
                    <span className="text-sm font-medium">I confirm I am over 18 years of age.</span>
                  </div>
                  {formData.ageVerified && <ShieldCheck size={18} className="text-green-600" />}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-brand-offwhite text-brand-black rounded-full">
                  <Wallet size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-serif italic">Settlement Details</h2>
                  <p className="text-[10px] uppercase tracking-widest text-brand-black/40">Establish your secure pipeline for earnings.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setFormData(p => ({...p, payoutProvider: 'bank'}))}
                    className={`flex-1 py-3 border text-[10px] uppercase tracking-widest font-bold rounded-sm transition-all ${formData.payoutProvider === 'bank' ? 'bg-brand-black text-white border-brand-black' : 'border-brand-border text-brand-black hover:border-brand-black'}`}
                  >
                    Direct Bank
                  </button>
                  <button 
                    onClick={() => setFormData(p => ({...p, payoutProvider: 'paypal'}))}
                    className={`flex-1 py-3 border text-[10px] uppercase tracking-widest font-bold rounded-sm transition-all ${formData.payoutProvider === 'paypal' ? 'bg-brand-black text-white border-brand-black' : 'border-brand-border text-brand-black hover:border-brand-black'}`}
                  >
                    PayPal Int.
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-black/60">
                    {formData.payoutProvider === 'bank' ? 'IBAN / Account Details' : 'PayPal Email'}
                  </label>
                  <input
                    type="text"
                    value={formData.payoutDetails}
                    onChange={(e) => setFormData(p => ({...p, payoutDetails: e.target.value}))}
                    className="w-full px-4 py-3 bg-brand-offwhite border border-brand-border focus:outline-none focus:border-brand-black text-sm transition-colors"
                    placeholder={formData.payoutProvider === 'bank' ? 'GB00 0000 0000...' : 'payment@example.com'}
                  />
                </div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-brand-black/40 text-center font-bold">
                  All settlements are processed on a net-weekly basis after verification.
                </p>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-brand-offwhite text-brand-black rounded-full">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-serif italic">Agency Agreement</h2>
                  <p className="text-[10px] uppercase tracking-widest text-brand-black/40">The formal bond between talent and agency.</p>
                </div>
              </div>

              <div className="h-64 bg-brand-offwhite border border-brand-border p-6 overflow-y-auto text-xs font-light leading-relaxed space-y-4">
                <p className="font-bold uppercase tracking-widest">Digital Asset Management Agreement</p>
                <p>1. Scope: Bramingham Barely serves as the exclusive operational management for all digital authoritative assets created by the Talent.</p>
                <p>2. Performance: Talent agrees to maintain the visual and communication standards established during onboarding.</p>
                <p>3. Privacy: The Agency guarantees absolute discretion and cryptographic security of all talent data.</p>
                <p>4. Scale: Our mission is to engineer your growth to the 0.1% tier through technical and cultural optimization.</p>
                <p>5. Commission: Standard agency commission of 20% applies to all gross digital earnings processed through our architecture.</p>
              </div>

              <div 
                onClick={() => setFormData(p => ({...p, termsAccepted: !p.termsAccepted}))}
                className="flex items-center space-x-4 cursor-pointer group"
              >
                <div className={`w-5 h-5 border rounded-sm flex items-center justify-center transition-all ${formData.termsAccepted ? 'bg-brand-black border-brand-black' : 'border-brand-border group-hover:border-brand-black'}`}>
                  {formData.termsAccepted && <Check size={12} className="text-white" />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-black/60 group-hover:text-brand-black transition-colors">I accept the terms of the Bramingham Barely Roster.</span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 pt-10 border-t border-brand-offwhite flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-black/40 hover:text-brand-black disabled:opacity-0 transition-all"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid() || loading}
              className="bg-brand-black text-white px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center space-x-3 hover:bg-brand-black/90 transition-all disabled:opacity-30 active:scale-95"
            >
              <span>{loading ? 'Processing...' : currentStep === STEPS.length - 1 ? 'Join the Roster' : 'Next Step'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </div>
        </motion.div>

        {/* Global Branding */}
        <div className="mt-12 flex items-center justify-center space-x-4 text-brand-black/30">
          <Sparkles size={16} />
          <span className="text-[9px] uppercase tracking-[0.5em] font-bold">Engineering Authority Since 2026</span>
          <Sparkles size={16} />
        </div>
      </div>
    </div>
  );
};
