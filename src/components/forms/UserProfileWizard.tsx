'use client';

import { useState, useCallback } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { profileSteps } from '@/data/profileSteps';
import { ProfileUtils } from '@/lib/profile';
import { ProfileValidation } from '@/lib/validation';
import { ProfileService } from '@/services/profile';
import type { UserProfile } from '@/types/UserProfile';

export function UserProfileWizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile, updateField } = useUserProfile();
  const profileService = new ProfileService();

  const currentStep = profileSteps[currentStepIndex];
  const isLastStep = currentStepIndex === profileSteps.length - 1;
  // Navigation
  const handleNext = useCallback(async () => {
    if (isLastStep) {
      setIsSubmitting(true);
      try {
        if (profile) {
          // 1. Normaliser les données localement
          const normalizedProfile = normalizeProfileData(profile);
          
          // 2. Mettre à jour le profil local avec les données normalisées
          Object.keys(normalizedProfile).forEach(key => {
            const typedKey = key as keyof UserProfile;
            if (normalizedProfile[typedKey] !== profile[typedKey]) {
              updateField(typedKey, normalizedProfile[typedKey]);
            }
          });
          
          // 3. Sauvegarder vers Supabase
          await profileService.saveProfile(normalizedProfile);
        }
      } catch (error) {
        console.error('Erreur lors de la finalisation:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [isLastStep, profile, profileService, updateField]);

  // Fonction pour normaliser les données du profil
  const normalizeProfileData = useCallback((profile: UserProfile): UserProfile => {
    const normalized = { ...profile };
    
    // Convertir disliked_foods de string vers string[] si nécessaire
    if (typeof normalized.disliked_foods === 'string') {
      normalized.disliked_foods = normalized.disliked_foods
        .split(',')
        .map(food => food.trim())
        .filter(food => food.length > 0);
    }
    
    return normalized;
  }, []);

  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const handleSkip = useCallback(() => {
    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [isLastStep]);

  // Handlers pour les différents types de champs
  const handleSelectOption = useCallback((value: string) => {
    const normalizedValue = ProfileUtils.normalizeValueForField(currentStep.key, value);
    updateField(currentStep.key, normalizedValue);
  }, [currentStep.key, updateField]);

  const handleMultiSelectOption = useCallback((value: string) => {
    const currentValues = (profile?.[currentStep.key] as string[]) || [];
    const normalizedValue = ProfileUtils.normalizeValueForField(currentStep.key, value);
    
    const newValues = currentValues.includes(normalizedValue)
      ? currentValues.filter(v => v !== normalizedValue)
      : [...currentValues, normalizedValue];
      
    updateField(currentStep.key, newValues);
  }, [currentStep.key, profile, updateField]);
  const handleInputChange = useCallback((value: string) => {
    if (ProfileUtils.isNumericField(currentStep.key)) {
      const numValue = ProfileUtils.validateNumericValue(value);
      if (numValue !== null) {
        updateField(currentStep.key, numValue);
      }
    } else if (currentStep.key === 'disliked_foods') {
      // Pour disliked_foods, on stocke la chaîne brute pour permettre la saisie libre
      // La conversion en tableau se fera à la sauvegarde
      updateField(currentStep.key, value);
    } else {
      updateField(currentStep.key, value);
    }
  }, [currentStep.key, updateField]);

  const handleBooleanChoice = useCallback((value: boolean) => {
    updateField(currentStep.key, value);
  }, [currentStep.key, updateField]);

  const handleDaysSelection = useCallback((day: string) => {
    const currentDays = (profile?.batch_days as string[]) || [];
    const normalizedDay = ProfileUtils.normalizeDayName(day);
    
    const newDays = currentDays.includes(normalizedDay)
      ? currentDays.filter(d => d !== normalizedDay)
      : [...currentDays, normalizedDay];
      
    updateField('batch_days', newDays);
  }, [profile?.batch_days, updateField]);

  // Validation de l'étape courante
  const isCurrentStepValid = useCallback(() => {
    return ProfileValidation.isStepValid(profile, currentStep);
  }, [profile, currentStep]);

  // Obtenir la valeur actuelle pour l'affichage
  const getCurrentValue = useCallback(() => {
    if (!profile) return null;
    return profile[currentStep.key];
  }, [profile, currentStep.key]);

  // Vérifier si une option est sélectionnée
  const isOptionSelected = useCallback((option: string) => {
    const currentValue = getCurrentValue();
    if (currentStep.type === 'multi-select') {
      return Array.isArray(currentValue) && currentValue.includes(ProfileUtils.normalizeValueForField(currentStep.key, option));
    }
    return ProfileUtils.normalizeValueForField(currentStep.key, option) === currentValue;
  }, [getCurrentValue, currentStep]);

  // Rendu des différents types de champs
  const renderField = () => {
    if (!currentStep) return null;

    switch (currentStep.type) {      case 'select':
        return (
          <div className="space-y-3">
            {currentStep.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleSelectOption(option)}
                className={`w-1/2 mx-auto block py-3 px-4 rounded-xl text-base transition-all ${
                  isOptionSelected(option)
                    ? 'bg-[#A3C9A8] text-white'
                    : 'bg-white border border-[#A3C9A8] text-[#A3C9A8] hover:bg-[#A3C9A8] hover:text-white'
                }`}
                aria-label={`Sélectionner ${option}`}
              >
                {option}
              </button>
            ))}
          </div>
        );      case 'multi-select':
        return (
          <div className="space-y-3">
            {currentStep.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleMultiSelectOption(option)}
                className={`w-1/2 mx-auto block py-3 px-4 rounded-xl text-base transition-all ${
                  isOptionSelected(option)
                    ? 'bg-[#A3C9A8] text-white'
                    : 'bg-white border border-[#A3C9A8] text-[#A3C9A8] hover:bg-[#A3C9A8] hover:text-white'
                }`}
                aria-label={`${isOptionSelected(option) ? 'Désélectionner' : 'Sélectionner'} ${option}`}
              >
                {option}
              </button>
            ))}
          </div>
        );      case 'input':
        const currentValue = getCurrentValue();
        const inputType = ProfileUtils.isNumericField(currentStep.key) ? 'number' : 'text';
        const displayValue = currentStep.key === 'disliked_foods' 
          ? typeof currentValue === 'string' 
            ? currentValue 
            : ProfileUtils.formatArrayToString(currentValue as string[])
          : currentValue?.toString() || '';

        return (
          <div className="space-y-2">
            <input
              type={inputType}
              value={displayValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={ProfileUtils.getPlaceholderForField(currentStep.key)}
              className="border border-[#A3C9A8] px-3 py-2 rounded-xl w-full text-base focus:ring-2 focus:ring-[#A3C9A8] focus:border-transparent"
              aria-label={currentStep.label}
              min={inputType === 'number' ? '1' : undefined}
            />
            {currentStep.key === 'disliked_foods' && (
              <p className="text-sm text-gray-500">Séparez par des virgules</p>
            )}
          </div>
        );      case 'boolean':
        const boolValue = getCurrentValue() as boolean;
        return (
          <div className="space-y-3">
            <button
              onClick={() => handleBooleanChoice(true)}
              className={`w-1/2 mx-auto block py-3 px-4 rounded-xl text-base transition-all ${
                boolValue === true
                  ? 'bg-[#A3C9A8] text-white'
                  : 'bg-white border border-[#A3C9A8] text-[#A3C9A8] hover:bg-[#A3C9A8] hover:text-white'
              }`}
              aria-label="Sélectionner Oui"
            >
              Oui
            </button>
            <button
              onClick={() => handleBooleanChoice(false)}
              className={`w-1/2 mx-auto block py-3 px-4 rounded-xl text-base transition-all ${
                boolValue === false
                  ? 'bg-[#A3C9A8] text-white'
                  : 'bg-white border border-[#A3C9A8] text-[#A3C9A8] hover:bg-[#A3C9A8] hover:text-white'
              }`}
              aria-label="Sélectionner Non"
            >
              Non
            </button>
          </div>
        );      case 'days':
        const daysOptions = ProfileUtils.getDaysOptions();
        const selectedDays = (profile?.batch_days as string[]) || [];
        
        return (
          <div className="space-y-3">
            {daysOptions.map((day) => (
              <button
                key={day}
                onClick={() => handleDaysSelection(day)}
                className={`w-1/2 mx-auto block py-3 px-4 rounded-xl text-base transition-all ${
                  selectedDays.includes(ProfileUtils.normalizeDayName(day))
                    ? 'bg-[#A3C9A8] text-white'
                    : 'bg-white border border-[#A3C9A8] text-[#A3C9A8] hover:bg-[#A3C9A8] hover:text-white'
                }`}
                aria-label={`${selectedDays.includes(ProfileUtils.normalizeDayName(day)) ? 'Désélectionner' : 'Sélectionner'} ${day}`}
              >
                {day}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (!currentStep) return null;

  return (
    <div className="max-w-md mx-auto py-8 px-4 min-h-[80vh] bg-[#FFFBF5]">
      {/* Question */}
      <h2 className="text-xl font-semibold text-center mb-6">
        {currentStep.label}
      </h2>

      {/* Champ */}
      <div className="mb-8">
        {renderField()}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
          className={`text-sm ${
            currentStepIndex === 0 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          aria-label="Étape précédente"
        >
          Précédent
        </button>

        <div className="flex gap-4">
          {!isLastStep && currentStep.optional && (
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700"
              aria-label="Passer cette étape"
            >
              Passer
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!isCurrentStepValid() || isSubmitting}
            className={`px-6 py-2 rounded-xl text-sm transition-all ${
              !isCurrentStepValid() || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#A3C9A8] text-white hover:bg-[#93b89a]'
            }`}
            aria-label={isLastStep ? 'Finaliser le profil' : 'Étape suivante'}
          >
            {isSubmitting ? 'Finalisation...' : (isLastStep ? 'Terminer' : 'Suivant')}
          </button>
        </div>
      </div>
    </div>
  );
}
