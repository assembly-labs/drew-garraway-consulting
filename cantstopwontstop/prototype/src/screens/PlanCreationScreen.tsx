import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { WorkoutPlan } from '../data/workoutPlans';
import { Exercise, exerciseLibrary } from '../data/exerciseLibrary';

interface PlanCreationScreenProps {
  onSave: (plan: WorkoutPlan) => void;
  onBack: () => void;
  existingPlan?: WorkoutPlan;
}

export const PlanCreationScreen: React.FC<PlanCreationScreenProps> = ({
  onSave,
  onBack,
  existingPlan,
}) => {
  const [planName, setPlanName] = useState(existingPlan?.name || '');
  const [planDescription, setPlanDescription] = useState(existingPlan?.description || '');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    existingPlan?.difficulty || 'Intermediate'
  );
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>(
    existingPlan?.exercises || []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];

  const filteredExercises = exerciseLibrary.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExercise = (exercise: Exercise) => {
    if (selectedExercises.find((e) => e.id === exercise.id)) {
      setSelectedExercises(selectedExercises.filter((e) => e.id !== exercise.id));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const handleSave = () => {
    if (!planName.trim() || selectedExercises.length === 0) {
      alert('Please enter a plan name and select at least one exercise.');
      return;
    }

    const estimatedTime = selectedExercises.reduce((total, ex) => {
      const exerciseTime = (ex.defaultSets * ex.defaultReps * 3 + ex.defaultSets * ex.restTime) / 60;
      return total + exerciseTime;
    }, 0);

    const plan: WorkoutPlan = {
      id: existingPlan?.id || `plan-${Date.now()}`,
      name: planName,
      description: planDescription,
      exercises: selectedExercises,
      estimatedTime: Math.ceil(estimatedTime),
      difficulty,
      category: selectedExercises.length > 0 ? selectedExercises[0].category : 'Custom',
    };

    onSave(plan);
  };

  return (
    <div
      style={{
        backgroundColor: colors.black,
        minHeight: '100dvh',
        padding: spacing.m,
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          marginTop: spacing.l,
          marginBottom: spacing.l,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.s,
          width: '100%',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: colors.white,
            fontSize: 'clamp(24px, 6vw, 32px)',
            cursor: 'pointer',
            padding: spacing.xs,
          }}
        >
          ←
        </button>
        <h1
          style={{
            fontSize: 'clamp(24px, 6vw, 32px)',
            fontWeight: 700,
            color: colors.white,
            flex: 1,
          }}
        >
          {existingPlan ? 'Edit Plan' : 'Create Plan'}
        </h1>
      </div>

      {/* Plan Details */}
      <div style={{ marginBottom: spacing.l, width: '100%' }}>
        <h3
          style={{
            fontSize: 'clamp(16px, 4vw, 18px)',
            fontWeight: 700,
            color: colors.white,
            marginBottom: spacing.s,
          }}
        >
          Plan Details
        </h3>
        <Input
          placeholder="Plan Name (e.g., Morning Burn)"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          style={{ marginBottom: spacing.s }}
        />
        <Input
          placeholder="Description (optional)"
          value={planDescription}
          onChange={(e) => setPlanDescription(e.target.value)}
          style={{ marginBottom: spacing.s }}
        />

        {/* Difficulty Selector */}
        <div style={{ display: 'flex', gap: spacing.xs, marginBottom: spacing.s }}>
          {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              style={{
                flex: 1,
                padding: spacing.s,
                background: difficulty === level ? colors.red : colors.gray800,
                border: 'none',
                borderRadius: '4px',
                color: colors.white,
                fontSize: 'clamp(12px, 3vw, 14px)',
                fontWeight: difficulty === level ? 700 : 400,
                cursor: 'pointer',
              }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Exercises */}
      {selectedExercises.length > 0 && (
        <div style={{ marginBottom: spacing.l, width: '100%' }}>
          <h3
            style={{
              fontSize: 'clamp(16px, 4vw, 18px)',
              fontWeight: 700,
              color: colors.white,
              marginBottom: spacing.s,
            }}
          >
            Selected Exercises ({selectedExercises.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, width: '100%' }}>
            {selectedExercises.map((exercise) => (
              <Card key={exercise.id} style={{ padding: spacing.s }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.s }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: colors.white, fontWeight: 600 }}>
                      {exercise.icon} {exercise.name}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleExercise(exercise)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: colors.red,
                      fontSize: 'clamp(18px, 4.5vw, 20px)',
                      cursor: 'pointer',
                      padding: spacing.xs,
                    }}
                  >
                    ✕
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Exercise Library */}
      <div style={{ marginBottom: spacing.l, width: '100%' }}>
        <h3
          style={{
            fontSize: 'clamp(16px, 4vw, 18px)',
            fontWeight: 700,
            color: colors.white,
            marginBottom: spacing.s,
          }}
        >
          Add Exercises
        </h3>

        {/* Search */}
        <Input
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: spacing.s }}
        />

        {/* Category Filter */}
        <div
          style={{
            display: 'flex',
            gap: spacing.xs,
            overflowX: 'auto',
            marginBottom: spacing.s,
            paddingBottom: spacing.xs,
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: `${spacing.xs} ${spacing.s}`,
                background: selectedCategory === category ? colors.red : colors.gray800,
                border: 'none',
                borderRadius: '4px',
                color: colors.white,
                fontSize: 'clamp(12px, 3vw, 14px)',
                fontWeight: selectedCategory === category ? 700 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Exercise List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, width: '100%' }}>
          {filteredExercises.map((exercise) => {
            const isSelected = selectedExercises.find((e) => e.id === exercise.id);
            return (
              <Card
                key={exercise.id}
                onClick={() => toggleExercise(exercise)}
                style={{
                  cursor: 'pointer',
                  borderColor: isSelected ? colors.red : colors.gray800,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.s }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 'clamp(14px, 3.5vw, 16px)',
                        fontWeight: 600,
                        color: colors.white,
                        marginBottom: spacing.xxs,
                        wordBreak: 'break-word',
                      }}
                    >
                      {exercise.icon} {exercise.name}
                    </div>
                    <div
                      style={{
                        fontSize: 'clamp(11px, 2.8vw, 12px)',
                        color: colors.gray500,
                      }}
                    >
                      {exercise.category} • {exercise.difficulty}
                    </div>
                  </div>
                  <div style={{ fontSize: 'clamp(20px, 5vw, 24px)', flexShrink: 0 }}>
                    {isSelected ? '✓' : '+'}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div style={{ marginTop: spacing.xl, marginBottom: spacing.xl, width: '100%' }}>
        <Button onClick={handleSave} size="large" fullWidth>
          {existingPlan ? 'UPDATE PLAN' : 'SAVE PLAN'}
        </Button>
      </div>
    </div>
  );
};
