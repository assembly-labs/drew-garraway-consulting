/**
 * Technique Videos Data
 *
 * Video catalog for technique library, parsed from technique_videos.csv
 * Videos are curated from priority instructors per brand philosophy.
 */

import type {
  TechniqueVideo,
  TechniqueVideoSet,
  PositionCategory,
  VideoRecommendation,
  RecommendationReason,
  ForYouSection,
} from '../types/techniqueVideos';
import type { BeltLevel, ProficiencyLevel } from '../types/database';

// ===========================================
// VIDEO DATA (from technique_videos.csv)
// ===========================================

/**
 * All curated technique videos
 * Source: /internal-docs/BJJ Ranking Criteria/bjj-techniques/technique_videos.csv
 */
export const techniqueVideos: TechniqueVideo[] = [
  // Closed Guard
  { technique_id: 'CG_001', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'CG_002', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'CG_003', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'CG_004', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'CG_008', video_type: 'instructional', youtube_id: 'LDE0fkzZT6I', instructor: 'John Danaher', title: 'How To Do The Perfect Triangle Choke Even If You Have Short Legs', duration_seconds: 840 },
  { technique_id: 'CG_008', video_type: 'instructional', youtube_id: 'VA6zjDN690s', instructor: 'John Danaher', title: 'Wrist Controls To Triangles', duration_seconds: 600 },
  { technique_id: 'CG_009', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'CG_010', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'CG_012', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'CG_013', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'CG_015', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'CG_016', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'CG_017', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'CG_025', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'CG_030', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },

  // Half Guard
  { technique_id: 'HG_001', video_type: 'instructional', youtube_id: 'Ze10eulM1xg', instructor: 'John Danaher', title: 'How To Build The Perfect Half Guard Game For No Gi', duration_seconds: 900 },
  { technique_id: 'HG_001', video_type: 'instructional', youtube_id: 'E8x1Cva8hJ8', instructor: 'John Danaher', title: 'How To Build The Perfect Half Guard Game', duration_seconds: 900 },
  { technique_id: 'HG_016', video_type: 'instructional', youtube_id: 'Ze10eulM1xg', instructor: 'John Danaher', title: 'How To Build The Perfect Half Guard Game For No Gi', duration_seconds: 900 },
  { technique_id: 'HG_019', video_type: 'instructional', youtube_id: 'Ze10eulM1xg', instructor: 'John Danaher', title: 'How To Build The Perfect Half Guard Game For No Gi', duration_seconds: 900 },
  { technique_id: 'HG_020', video_type: 'instructional', youtube_id: 'Ze10eulM1xg', instructor: 'John Danaher', title: 'How To Build The Perfect Half Guard Game For No Gi', duration_seconds: 900 },
  { technique_id: 'HG_024', video_type: 'instructional', youtube_id: 'Ze10eulM1xg', instructor: 'John Danaher', title: 'How To Build The Perfect Half Guard Game For No Gi', duration_seconds: 900 },

  // Open Guard
  { technique_id: 'OG_019', video_type: 'instructional', youtube_id: 'MXcQfCIh7n4', instructor: 'Gordon Ryan', title: 'The Most Basic Principles Of Butterfly And Open Guard', duration_seconds: 780 },
  { technique_id: 'OG_019', video_type: 'instructional', youtube_id: 'Fcg4mtegux0', instructor: 'John Danaher', title: 'Understanding The Open Guard In BJJ', duration_seconds: 720 },
  { technique_id: 'OG_020', video_type: 'instructional', youtube_id: 'MXcQfCIh7n4', instructor: 'Gordon Ryan', title: 'The Most Basic Principles Of Butterfly And Open Guard', duration_seconds: 780 },

  // Mount
  { technique_id: 'MT_001', video_type: 'instructional', youtube_id: 'tyI3aszI4qo', instructor: 'Gordon Ryan', title: 'Early Hand Fighting From Mount', duration_seconds: 600 },
  { technique_id: 'MT_004', video_type: 'instructional', youtube_id: 'tyI3aszI4qo', instructor: 'Gordon Ryan', title: 'Early Hand Fighting From Mount', duration_seconds: 600 },
  { technique_id: 'MT_007', video_type: 'instructional', youtube_id: 'tyI3aszI4qo', instructor: 'Gordon Ryan', title: 'Early Hand Fighting From Mount', duration_seconds: 600 },
  { technique_id: 'MT_008', video_type: 'instructional', youtube_id: 'tyI3aszI4qo', instructor: 'Gordon Ryan', title: 'Early Hand Fighting From Mount', duration_seconds: 600 },
  { technique_id: 'MT_009', video_type: 'instructional', youtube_id: 'tyI3aszI4qo', instructor: 'Gordon Ryan', title: 'Early Hand Fighting From Mount', duration_seconds: 600 },
  { technique_id: 'MT_010', video_type: 'instructional', youtube_id: 'tyI3aszI4qo', instructor: 'Gordon Ryan', title: 'Early Hand Fighting From Mount', duration_seconds: 600 },
  { technique_id: 'MT_015', video_type: 'instructional', youtube_id: 'tyI3aszI4qo', instructor: 'Gordon Ryan', title: 'Early Hand Fighting From Mount', duration_seconds: 600 },

  // Side Control
  { technique_id: 'SC_001', video_type: 'instructional', youtube_id: 'gnAhAdE_A90', instructor: 'Lachlan Giles', title: 'The Best Way To Escape Side Control', duration_seconds: 540 },
  { technique_id: 'SC_001', video_type: 'instructional', youtube_id: 'swEcP2QWHs8', instructor: 'Lachlan Giles', title: 'Linking 4 Different Side Control Escapes', duration_seconds: 660 },
  { technique_id: 'SC_002', video_type: 'instructional', youtube_id: 'gnAhAdE_A90', instructor: 'Lachlan Giles', title: 'The Best Way To Escape Side Control', duration_seconds: 540 },
  { technique_id: 'SC_006', video_type: 'instructional', youtube_id: 'gnAhAdE_A90', instructor: 'Lachlan Giles', title: 'The Best Way To Escape Side Control', duration_seconds: 540 },
  { technique_id: 'SC_007', video_type: 'instructional', youtube_id: 'gnAhAdE_A90', instructor: 'Lachlan Giles', title: 'The Best Way To Escape Side Control', duration_seconds: 540 },
  { technique_id: 'SC_012', video_type: 'instructional', youtube_id: 'gnAhAdE_A90', instructor: 'Lachlan Giles', title: 'The Best Way To Escape Side Control', duration_seconds: 540 },
  { technique_id: 'SC_013', video_type: 'instructional', youtube_id: 'gnAhAdE_A90', instructor: 'Lachlan Giles', title: 'The Best Way To Escape Side Control', duration_seconds: 540 },
  { technique_id: 'SC_016', video_type: 'instructional', youtube_id: 'cuXq-k__9lQ', instructor: 'John Danaher', title: 'How To Do The Perfect BJJ Side Control Escape', duration_seconds: 720 },
  { technique_id: 'SC_016', video_type: 'instructional', youtube_id: 'gnAhAdE_A90', instructor: 'Lachlan Giles', title: 'The Best Way To Escape Side Control', duration_seconds: 540 },
  { technique_id: 'SC_016', video_type: 'instructional', youtube_id: 'rhYdYtMhDac', instructor: 'Lachlan Giles', title: 'The Best Way To Escape Side Control Part 2', duration_seconds: 480 },
  { technique_id: 'SC_016', video_type: 'instructional', youtube_id: '59NfnauqwIQ', instructor: 'Lachlan Giles', title: 'Escape Side Control Fundamentals Part 2', duration_seconds: 420 },
  { technique_id: 'SC_019', video_type: 'instructional', youtube_id: 'gnAhAdE_A90', instructor: 'Lachlan Giles', title: 'The Best Way To Escape Side Control', duration_seconds: 540 },

  // Back Control
  { technique_id: 'BC_001', video_type: 'instructional', youtube_id: 'k-lCzVAzJpg', instructor: 'Lachlan Giles', title: 'Escaping The Back - Pay Attention To The Leg Work', duration_seconds: 600 },
  { technique_id: 'BC_003', video_type: 'instructional', youtube_id: 'k-lCzVAzJpg', instructor: 'Lachlan Giles', title: 'Escaping The Back - Pay Attention To The Leg Work', duration_seconds: 600 },
  { technique_id: 'BC_005', video_type: 'instructional', youtube_id: 'FpJTnOEkqYI', instructor: 'Craig Jones', title: 'Finishing A Mandible Rear Naked', duration_seconds: 420 },
  { technique_id: 'BC_005', video_type: 'instructional', youtube_id: 'WnNtD9kPBvs', instructor: 'Craig Jones', title: 'Rear Ezekiel', duration_seconds: 360 },
  { technique_id: 'BC_011', video_type: 'instructional', youtube_id: 'k-lCzVAzJpg', instructor: 'Lachlan Giles', title: 'Escaping The Back - Pay Attention To The Leg Work', duration_seconds: 600 },
  { technique_id: 'BC_014', video_type: 'instructional', youtube_id: 'k-lCzVAzJpg', instructor: 'Lachlan Giles', title: 'Escaping The Back - Pay Attention To The Leg Work', duration_seconds: 600 },
  { technique_id: 'BC_014', video_type: 'instructional', youtube_id: '8XBJboAGzRk', instructor: 'Lachlan Giles', title: 'Escape The Back PT2 - Clearing The Arm To The Other Side', duration_seconds: 480 },
  { technique_id: 'BC_014', video_type: 'instructional', youtube_id: 'uT-7lJxykCg', instructor: 'Craig Jones', title: 'Back Escape Technique', duration_seconds: 360 },

  // North South
  { technique_id: 'NS_007', video_type: 'instructional', youtube_id: 'KG916GxW-88', instructor: 'Lachlan Giles', title: 'Escaping North South And Choosing The Correct Escape', duration_seconds: 540 },

  // Takedowns
  { technique_id: 'TD_001', video_type: 'instructional', youtube_id: 'FksRO4JgQck', instructor: 'Stephan Kesting', title: 'Single And Double Leg Takedowns For Beginners', duration_seconds: 600 },
  { technique_id: 'TD_002', video_type: 'instructional', youtube_id: 'FksRO4JgQck', instructor: 'Stephan Kesting', title: 'Single And Double Leg Takedowns For Beginners', duration_seconds: 600 },
  { technique_id: 'TD_006', video_type: 'instructional', youtube_id: 'JX0HL0WpYPs', instructor: 'Gordon Ryan', title: 'How To Do The Perfect Front Headlock And Turtle Escapes', duration_seconds: 720 },
  { technique_id: 'TD_008', video_type: 'instructional', youtube_id: '-zgwLkCoWDw', instructor: 'John Danaher', title: 'The Importance Of BJJ Fundamentals', duration_seconds: 780 },
  { technique_id: 'TD_009', video_type: 'instructional', youtube_id: '-zgwLkCoWDw', instructor: 'John Danaher', title: 'The Importance Of BJJ Fundamentals', duration_seconds: 780 },
  { technique_id: 'TD_010', video_type: 'instructional', youtube_id: '-zgwLkCoWDw', instructor: 'John Danaher', title: 'The Importance Of BJJ Fundamentals', duration_seconds: 780 },
  { technique_id: 'TD_018', video_type: 'instructional', youtube_id: 'nU9YxDabnSU', instructor: 'Gordon Ryan', title: 'Understanding The Closed Guard', duration_seconds: 660 },

  // Clinch
  { technique_id: 'CL_001', video_type: 'instructional', youtube_id: 'JX0HL0WpYPs', instructor: 'Gordon Ryan', title: 'How To Do The Perfect Front Headlock And Turtle Escapes', duration_seconds: 720 },
  { technique_id: 'CL_002', video_type: 'instructional', youtube_id: 'JX0HL0WpYPs', instructor: 'Gordon Ryan', title: 'How To Do The Perfect Front Headlock And Turtle Escapes', duration_seconds: 720 },
  { technique_id: 'CL_003', video_type: 'instructional', youtube_id: 'JX0HL0WpYPs', instructor: 'Gordon Ryan', title: 'How To Do The Perfect Front Headlock And Turtle Escapes', duration_seconds: 720 },
  { technique_id: 'CL_005', video_type: 'instructional', youtube_id: 'JX0HL0WpYPs', instructor: 'Gordon Ryan', title: 'How To Do The Perfect Front Headlock And Turtle Escapes', duration_seconds: 720 },
  { technique_id: 'CL_006', video_type: 'instructional', youtube_id: 'JX0HL0WpYPs', instructor: 'Gordon Ryan', title: 'How To Do The Perfect Front Headlock And Turtle Escapes', duration_seconds: 720 },
  { technique_id: 'CL_007', video_type: 'instructional', youtube_id: 'JX0HL0WpYPs', instructor: 'Gordon Ryan', title: 'How To Do The Perfect Front Headlock And Turtle Escapes', duration_seconds: 720 },
  { technique_id: 'CL_008', video_type: 'instructional', youtube_id: 'JX0HL0WpYPs', instructor: 'Gordon Ryan', title: 'How To Do The Perfect Front Headlock And Turtle Escapes', duration_seconds: 720 },
  { technique_id: 'CL_009', video_type: 'instructional', youtube_id: 'JX0HL0WpYPs', instructor: 'Gordon Ryan', title: 'How To Do The Perfect Front Headlock And Turtle Escapes', duration_seconds: 720 },
  { technique_id: 'CL_012', video_type: 'instructional', youtube_id: 'JX0HL0WpYPs', instructor: 'Gordon Ryan', title: 'How To Do The Perfect Front Headlock And Turtle Escapes', duration_seconds: 720 },
  { technique_id: 'CL_014', video_type: 'instructional', youtube_id: 'JX0HL0WpYPs', instructor: 'Gordon Ryan', title: 'How To Do The Perfect Front Headlock And Turtle Escapes', duration_seconds: 720 },
  { technique_id: 'CL_017', video_type: 'instructional', youtube_id: 'Zvn--8vW1sI', instructor: 'Gordon Ryan', title: 'Head And Arm Guillotine Choke Escape', duration_seconds: 480 },

  // Guard Passing
  { technique_id: 'GP_002', video_type: 'instructional', youtube_id: 'r-FNcolHsg4', instructor: 'Gordon Ryan', title: 'Learn How To Do The Perfect Jiu Jitsu Body Lock Pass', duration_seconds: 780 },
  { technique_id: 'GP_003', video_type: 'instructional', youtube_id: 'isv_6Hd1Iac', instructor: 'John Danaher', title: 'How To Perfect Your Guard Passing No Gi', duration_seconds: 720 },
  { technique_id: 'GP_004', video_type: 'instructional', youtube_id: 'isv_6Hd1Iac', instructor: 'John Danaher', title: 'How To Perfect Your Guard Passing No Gi', duration_seconds: 720 },
  { technique_id: 'GP_005', video_type: 'instructional', youtube_id: 'Jz4oLDOHxLM', instructor: 'John Danaher', title: 'How To Do The Perfect Jiu Jitsu Half Guard Passing', duration_seconds: 780 },
  { technique_id: 'GP_005', video_type: 'instructional', youtube_id: 'qrlXfEOk_44', instructor: 'Lachlan Giles', title: 'How To Pass The BJJ Half Guard No Gi', duration_seconds: 600 },
  { technique_id: 'GP_008', video_type: 'instructional', youtube_id: 'ODuQCA88oY4', instructor: 'John Danaher', title: '5 Tips To Pass ANY Guard', duration_seconds: 660 },
  { technique_id: 'GP_008', video_type: 'instructional', youtube_id: 'Zp9O6YpHKeE', instructor: 'Lachlan Giles', title: '5 Tips To Pass Any Guard No Gi', duration_seconds: 600 },
  { technique_id: 'GP_010', video_type: 'instructional', youtube_id: 'ODuQCA88oY4', instructor: 'John Danaher', title: '5 Tips To Pass ANY Guard', duration_seconds: 660 },
  { technique_id: 'GP_016', video_type: 'instructional', youtube_id: 'LLSSUrds01E', instructor: 'Lachlan Giles', title: 'Passing Butterfly Guard With The Body Lock', duration_seconds: 540 },
  { technique_id: 'GP_017', video_type: 'instructional', youtube_id: 'isv_6Hd1Iac', instructor: 'John Danaher', title: 'How To Perfect Your Guard Passing No Gi', duration_seconds: 720 },
  { technique_id: 'GP_020', video_type: 'instructional', youtube_id: 'Jz4oLDOHxLM', instructor: 'John Danaher', title: 'How To Do The Perfect Jiu Jitsu Half Guard Passing', duration_seconds: 780 },
  { technique_id: 'GP_020', video_type: 'instructional', youtube_id: 'qrlXfEOk_44', instructor: 'Lachlan Giles', title: 'How To Pass The BJJ Half Guard No Gi', duration_seconds: 600 },
  { technique_id: 'GP_020', video_type: 'instructional', youtube_id: 'yZ4mrxCUl_Q', instructor: 'Lachlan Giles', title: '6 Approaches To Passing The Knee Shield', duration_seconds: 660 },
  { technique_id: 'GP_021', video_type: 'instructional', youtube_id: 'isv_6Hd1Iac', instructor: 'John Danaher', title: 'How To Perfect Your Guard Passing No Gi', duration_seconds: 720 },
  { technique_id: 'GP_024', video_type: 'instructional', youtube_id: 'GCWfLiI51ds', instructor: 'Lachlan Giles', title: 'Understanding Guard Passing - Concepts And Heuristics', duration_seconds: 900 },
  { technique_id: 'GP_025', video_type: 'instructional', youtube_id: 'Zp9O6YpHKeE', instructor: 'Lachlan Giles', title: '5 Tips To Pass Any Guard No Gi', duration_seconds: 600 },

  // Turtle
  { technique_id: 'TT_001', video_type: 'instructional', youtube_id: 'A8JVwd_OoSY', instructor: 'Gordon Ryan', title: 'Jiu Jitsu vs Wrestling - Understanding Turtle Position', duration_seconds: 600 },
  { technique_id: 'TT_001', video_type: 'instructional', youtube_id: 'iMI43_ct0_o', instructor: 'Gordon Ryan', title: 'Intro To Escaping Turtle Position', duration_seconds: 540 },
  { technique_id: 'TT_002', video_type: 'instructional', youtube_id: 'JX0HL0WpYPs', instructor: 'Gordon Ryan', title: 'How To Do The Perfect Front Headlock And Turtle Escapes', duration_seconds: 720 },
  { technique_id: 'TT_005', video_type: 'instructional', youtube_id: 'JX0HL0WpYPs', instructor: 'Gordon Ryan', title: 'How To Do The Perfect Front Headlock And Turtle Escapes', duration_seconds: 720 },
  { technique_id: 'TT_015', video_type: 'instructional', youtube_id: '7c_QyTpJy-k', instructor: 'Lachlan Giles', title: 'Guard Recovery And Inverting', duration_seconds: 600 },

  // Knee on Belly
  { technique_id: 'KB_008', video_type: 'instructional', youtube_id: 'gnAhAdE_A90', instructor: 'Lachlan Giles', title: 'The Best Way To Escape Side Control', duration_seconds: 540 },

  // Submissions
  { technique_id: 'SM_001', video_type: 'instructional', youtube_id: 'FpJTnOEkqYI', instructor: 'Craig Jones', title: 'Finishing A Mandible Rear Naked', duration_seconds: 420 },
  { technique_id: 'SM_004', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'SM_005', video_type: 'instructional', youtube_id: 'LDE0fkzZT6I', instructor: 'John Danaher', title: 'How To Do The Perfect Triangle Choke Even If You Have Short Legs', duration_seconds: 840 },
  { technique_id: 'SM_005', video_type: 'instructional', youtube_id: 'xnlx_hNfuZ4', instructor: 'Craig Jones', title: 'Triangle Choke Set Up On The Mount', duration_seconds: 480 },
  { technique_id: 'SM_010', video_type: 'instructional', youtube_id: 'Zvn--8vW1sI', instructor: 'Gordon Ryan', title: 'Head And Arm Guillotine Choke Escape', duration_seconds: 480 },
  { technique_id: 'SM_020', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'SM_021', video_type: 'instructional', youtube_id: 'tyI3aszI4qo', instructor: 'Gordon Ryan', title: 'Early Hand Fighting From Mount', duration_seconds: 600 },
  { technique_id: 'SM_022', video_type: 'instructional', youtube_id: 'i-GjsFQbziE', instructor: 'Craig Jones', title: 'Kimura Escape From Top Half Guard', duration_seconds: 420 },
  { technique_id: 'SM_028', video_type: 'instructional', youtube_id: 'CFTLb8iywJg', instructor: 'Lachlan Giles', title: 'Defending And Escaping The Saddle', duration_seconds: 600 },
  { technique_id: 'SM_028', video_type: 'instructional', youtube_id: 'DrjbaXt-nTo', instructor: 'Lachlan Giles', title: 'Rolling Out Of Heel Hooks', duration_seconds: 480 },

  // New additions - Expanded coverage
  { technique_id: 'CG_011', video_type: 'instructional', youtube_id: 'PLa07zdiPZk', instructor: 'Lachlan Giles', title: 'Omoplata From Open Guard Explained', duration_seconds: 720 },
  { technique_id: 'CG_005', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'CG_006', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'CG_007', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'CG_014', video_type: 'instructional', youtube_id: 'k-lCzVAzJpg', instructor: 'Lachlan Giles', title: 'Escaping The Back - Pay Attention To The Leg Work', duration_seconds: 600 },
  { technique_id: 'CG_019', video_type: 'instructional', youtube_id: 'MXcQfCIh7n4', instructor: 'Gordon Ryan', title: 'The Most Basic Principles Of Butterfly And Open Guard', duration_seconds: 780 },

  // Mount - Additional coverage
  { technique_id: 'MT_002', video_type: 'instructional', youtube_id: 'tyI3aszI4qo', instructor: 'Gordon Ryan', title: 'Early Hand Fighting From Mount', duration_seconds: 600 },
  { technique_id: 'MT_003', video_type: 'instructional', youtube_id: 'tyI3aszI4qo', instructor: 'Gordon Ryan', title: 'Early Hand Fighting From Mount', duration_seconds: 600 },
  { technique_id: 'MT_005', video_type: 'instructional', youtube_id: 'tyI3aszI4qo', instructor: 'Gordon Ryan', title: 'Early Hand Fighting From Mount', duration_seconds: 600 },
  { technique_id: 'MT_006', video_type: 'instructional', youtube_id: 'tyI3aszI4qo', instructor: 'Gordon Ryan', title: 'Early Hand Fighting From Mount', duration_seconds: 600 },

  // Knee on Belly - Expanded coverage
  { technique_id: 'KB_001', video_type: 'instructional', youtube_id: 'gnAhAdE_A90', instructor: 'Lachlan Giles', title: 'The Best Way To Escape Side Control', duration_seconds: 540 },
  { technique_id: 'KB_002', video_type: 'instructional', youtube_id: 'gnAhAdE_A90', instructor: 'Lachlan Giles', title: 'The Best Way To Escape Side Control', duration_seconds: 540 },
  { technique_id: 'KB_003', video_type: 'instructional', youtube_id: 'gnAhAdE_A90', instructor: 'Lachlan Giles', title: 'The Best Way To Escape Side Control', duration_seconds: 540 },

  // North-South - Expanded coverage
  { technique_id: 'NS_001', video_type: 'instructional', youtube_id: 'KG916GxW-88', instructor: 'Lachlan Giles', title: 'Escaping North South And Choosing The Correct Escape', duration_seconds: 540 },
  { technique_id: 'NS_002', video_type: 'instructional', youtube_id: 'KG916GxW-88', instructor: 'Lachlan Giles', title: 'Escaping North South And Choosing The Correct Escape', duration_seconds: 540 },
  { technique_id: 'NS_003', video_type: 'instructional', youtube_id: 'KG916GxW-88', instructor: 'Lachlan Giles', title: 'Escaping North South And Choosing The Correct Escape', duration_seconds: 540 },

  // Half Guard - Additional coverage
  { technique_id: 'HG_002', video_type: 'instructional', youtube_id: 'Ze10eulM1xg', instructor: 'John Danaher', title: 'How To Build The Perfect Half Guard Game For No Gi', duration_seconds: 900 },
  { technique_id: 'HG_003', video_type: 'instructional', youtube_id: 'Ze10eulM1xg', instructor: 'John Danaher', title: 'How To Build The Perfect Half Guard Game For No Gi', duration_seconds: 900 },
  { technique_id: 'HG_004', video_type: 'instructional', youtube_id: 'E8x1Cva8hJ8', instructor: 'John Danaher', title: 'How To Build The Perfect Half Guard Game', duration_seconds: 900 },

  // Submissions - Additional coverage
  { technique_id: 'SM_002', video_type: 'instructional', youtube_id: 'FpJTnOEkqYI', instructor: 'Craig Jones', title: 'Finishing A Mandible Rear Naked', duration_seconds: 420 },
  { technique_id: 'SM_003', video_type: 'instructional', youtube_id: 'LDE0fkzZT6I', instructor: 'John Danaher', title: 'How To Do The Perfect Triangle Choke Even If You Have Short Legs', duration_seconds: 840 },
  { technique_id: 'SM_006', video_type: 'instructional', youtube_id: 'Zvn--8vW1sI', instructor: 'Gordon Ryan', title: 'Head And Arm Guillotine Choke Escape', duration_seconds: 480 },
  { technique_id: 'SM_007', video_type: 'instructional', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'John Danaher Explains Closed Guard Fundamentals', duration_seconds: 720 },
  { technique_id: 'SM_008', video_type: 'instructional', youtube_id: 'tyI3aszI4qo', instructor: 'Gordon Ryan', title: 'Early Hand Fighting From Mount', duration_seconds: 600 },

  // Open Guard - Additional coverage
  { technique_id: 'OG_001', video_type: 'instructional', youtube_id: 'MXcQfCIh7n4', instructor: 'Gordon Ryan', title: 'The Most Basic Principles Of Butterfly And Open Guard', duration_seconds: 780 },
  { technique_id: 'OG_002', video_type: 'instructional', youtube_id: 'MXcQfCIh7n4', instructor: 'Gordon Ryan', title: 'The Most Basic Principles Of Butterfly And Open Guard', duration_seconds: 780 },
  { technique_id: 'OG_003', video_type: 'instructional', youtube_id: 'Fcg4mtegux0', instructor: 'John Danaher', title: 'Understanding The Open Guard In BJJ', duration_seconds: 720 },

  // Back Control - Additional coverage
  { technique_id: 'BC_002', video_type: 'instructional', youtube_id: 'k-lCzVAzJpg', instructor: 'Lachlan Giles', title: 'Escaping The Back - Pay Attention To The Leg Work', duration_seconds: 600 },
  { technique_id: 'BC_004', video_type: 'instructional', youtube_id: 'FpJTnOEkqYI', instructor: 'Craig Jones', title: 'Finishing A Mandible Rear Naked', duration_seconds: 420 },
  { technique_id: 'BC_006', video_type: 'instructional', youtube_id: 'k-lCzVAzJpg', instructor: 'Lachlan Giles', title: 'Escaping The Back - Pay Attention To The Leg Work', duration_seconds: 600 },

  // ===========================================
  // MINDSET & LIFESTYLE VIDEOS
  // ===========================================

  // Belt Journey (BJ_) - Psychology at each belt level
  { technique_id: 'BJ_001', video_type: 'mindset', youtube_id: 'dGz-wpjdoXY', instructor: 'Chewjitsu', title: 'White Belt Survival Guide - What To Focus On', duration_seconds: 720 },
  { technique_id: 'BJ_002', video_type: 'mindset', youtube_id: 'V8bPzGjCF7o', instructor: 'Chewjitsu', title: 'Being Comfortable Being Bad - White Belt Mindset', duration_seconds: 540 },
  { technique_id: 'BJ_003', video_type: 'mindset', youtube_id: 'xRlBvG4cqYU', instructor: 'Chewjitsu', title: 'The Blue Belt Blues - Why It Happens And How To Beat It', duration_seconds: 900 },
  { technique_id: 'BJ_004', video_type: 'mindset', youtube_id: '3CnbPuQp9qc', instructor: 'Chewjitsu', title: 'Why Blue Belts Quit BJJ - Breaking The Cycle', duration_seconds: 780 },
  { technique_id: 'BJ_005', video_type: 'mindset', youtube_id: 'kQvpJg4xbzU', instructor: 'Chewjitsu', title: 'Purple Belt Plateau - The Middle Child Syndrome', duration_seconds: 660 },
  { technique_id: 'BJ_006', video_type: 'mindset', youtube_id: 'WmDpHV3xnJo', instructor: 'Jon Thomas', title: 'What Changed When I Got My Black Belt', duration_seconds: 720 },
  { technique_id: 'BJ_007', video_type: 'mindset', youtube_id: 'qH8OvqXYY7c', instructor: 'Bernardo Faria', title: 'My Journey From White Belt To World Champion', duration_seconds: 1200 },

  // Mental Game (MG_) - Competition anxiety, ego, flow state
  { technique_id: 'MG_001', video_type: 'mindset', youtube_id: 'pG8X1OUvk_8', instructor: 'Chewjitsu', title: 'Dealing With Competition Anxiety In BJJ', duration_seconds: 840 },
  { technique_id: 'MG_002', video_type: 'mindset', youtube_id: 'E5SIz1a6rJU', instructor: 'Chewjitsu', title: 'How To Handle Getting Smashed In Training', duration_seconds: 600 },
  { technique_id: 'MG_003', video_type: 'mindset', youtube_id: 'nLJJI8kpNFY', instructor: 'Firas Zahabi', title: 'The Flow State In Jiu Jitsu - Finding The Zone', duration_seconds: 720 },
  { technique_id: 'MG_004', video_type: 'mindset', youtube_id: 'IdTMDpizis8', instructor: 'Jocko Willink', title: 'Discipline Equals Freedom - BJJ And Life', duration_seconds: 480 },
  { technique_id: 'MG_005', video_type: 'mindset', youtube_id: 'VfZTbz3DxPE', instructor: 'Chewjitsu', title: 'Ego Death On The Mat - Learning To Lose Gracefully', duration_seconds: 660 },
  { technique_id: 'MG_006', video_type: 'mindset', youtube_id: 'JtBjsQfLfZM', instructor: 'Stephan Kesting', title: 'Managing Pre-Competition Nerves', duration_seconds: 540 },
  { technique_id: 'MG_007', video_type: 'mindset', youtube_id: '1r_k18MX5IA', instructor: 'Jon Thomas', title: 'Recovering From A Competition Loss', duration_seconds: 600 },

  // Age & Longevity (AL_) - Training over 40, injury prevention
  { technique_id: 'AL_001', video_type: 'lifestyle', youtube_id: 'uwXQGw8gwcs', instructor: 'Tom DeBlass', title: 'Middle Aged BJJ - Training Smart After 40', duration_seconds: 900 },
  { technique_id: 'AL_002', video_type: 'lifestyle', youtube_id: 'DLLqI_m2fpo', instructor: 'Stephan Kesting', title: 'BJJ For Older Grapplers - Key Strategies', duration_seconds: 840 },
  { technique_id: 'AL_003', video_type: 'lifestyle', youtube_id: 'e9q0pD3zYPY', instructor: 'Rob Biernacki', title: 'Sloth Jiu Jitsu - Being Slow And Successful', duration_seconds: 780 },
  { technique_id: 'AL_004', video_type: 'lifestyle', youtube_id: 'mJkHOy6rXZ0', instructor: 'Tom DeBlass', title: 'Recovery Tips For Older BJJ Athletes', duration_seconds: 600 },
  { technique_id: 'AL_005', video_type: 'lifestyle', youtube_id: 'aN1EWXXYvHU', instructor: 'Stephan Kesting', title: 'Protecting Your Body - Longevity In BJJ', duration_seconds: 720 },
  { technique_id: 'AL_006', video_type: 'lifestyle', youtube_id: 'qrP1Nrw9FKo', instructor: 'Firas Zahabi', title: 'Training Smarter Not Harder - Recovery Science', duration_seconds: 660 },

  // Lifestyle Balance (LB_) - Work-life, motivation, consistency
  { technique_id: 'LB_001', video_type: 'lifestyle', youtube_id: 'rDGdLr8_qQw', instructor: 'Chewjitsu', title: 'Balancing BJJ With A Full Time Job', duration_seconds: 720 },
  { technique_id: 'LB_002', video_type: 'lifestyle', youtube_id: 'KvPn9cTRPaI', instructor: 'Chewjitsu', title: 'BJJ As A Parent - Making Time For Training', duration_seconds: 600 },
  { technique_id: 'LB_003', video_type: 'lifestyle', youtube_id: 'p0TL2mZsxYs', instructor: 'Chewjitsu', title: 'Avoiding Burnout In Jiu Jitsu', duration_seconds: 660 },
  { technique_id: 'LB_004', video_type: 'lifestyle', youtube_id: 'dLEY6YhJgbw', instructor: 'Chewjitsu', title: 'Finding Motivation When You Dont Want To Train', duration_seconds: 540 },
  { technique_id: 'LB_005', video_type: 'lifestyle', youtube_id: 'WqHiRXRgE9Y', instructor: 'Bernardo Faria', title: 'The Power Of Consistency Over Intensity', duration_seconds: 480 },
  { technique_id: 'LB_006', video_type: 'lifestyle', youtube_id: 'mG7AqXOvbzE', instructor: 'Jon Thomas', title: 'Creating The Optimal Training Environment', duration_seconds: 720 },

  // Injury & Recovery (IR_) - Coming back from injury, prehab
  { technique_id: 'IR_001', video_type: 'lifestyle', youtube_id: 'X9r3K1OjmKI', instructor: 'Stephan Kesting', title: 'Coming Back From A BJJ Injury - The Smart Way', duration_seconds: 840 },
  { technique_id: 'IR_002', video_type: 'lifestyle', youtube_id: 'vZLVmKyGCwE', instructor: 'Tom DeBlass', title: 'Training Around Injuries - Dont Stop Completely', duration_seconds: 600 },
  { technique_id: 'IR_003', video_type: 'lifestyle', youtube_id: 'WJzPmqXiHxg', instructor: 'Chewjitsu', title: 'Knowing When To Tap - Ego Vs Safety', duration_seconds: 540 },
  { technique_id: 'IR_004', video_type: 'lifestyle', youtube_id: 'R6j9wFymONI', instructor: 'Stephan Kesting', title: 'Prehab For BJJ - Preventing Common Injuries', duration_seconds: 720 },
  { technique_id: 'IR_005', video_type: 'lifestyle', youtube_id: 'hJmEIXHpHNc', instructor: 'Firas Zahabi', title: 'The Mental Challenge Of Injury Recovery', duration_seconds: 600 },
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Get all videos for a specific technique
 */
export function getVideosForTechnique(techniqueId: string): TechniqueVideoSet {
  const videos = techniqueVideos.filter(v => v.technique_id === techniqueId);

  return {
    technique_id: techniqueId,
    instructional: videos.filter(v => v.video_type === 'instructional'),
    quicktip: videos.filter(v => v.video_type === 'quicktip'),
    competition: videos.filter(v => v.video_type === 'competition'),
    chain: videos.filter(v => v.video_type === 'chain'),
  };
}

/**
 * Get all mindset & lifestyle videos
 */
export function getMindsetVideos(): TechniqueVideo[] {
  return techniqueVideos.filter(v =>
    v.video_type === 'mindset' || v.video_type === 'lifestyle'
  );
}

/**
 * Get mindset videos by category
 */
export function getMindsetVideosByCategory(category: 'belt_journey' | 'mental_game' | 'age_longevity' | 'lifestyle' | 'injury_recovery'): TechniqueVideo[] {
  const prefixMap: Record<string, string> = {
    belt_journey: 'BJ',
    mental_game: 'MG',
    age_longevity: 'AL',
    lifestyle: 'LB',
    injury_recovery: 'IR',
  };
  const prefix = prefixMap[category];
  return techniqueVideos.filter(v => v.technique_id.startsWith(prefix));
}

/**
 * Get all videos by instructor
 */
export function getVideosByInstructor(instructor: string): TechniqueVideo[] {
  return techniqueVideos.filter(v => v.instructor === instructor);
}

/**
 * Get unique technique IDs that have videos
 */
export function getTechniqueIdsWithVideos(): string[] {
  return [...new Set(techniqueVideos.map(v => v.technique_id))];
}

/**
 * Check if a technique has videos
 */
export function hasVideos(techniqueId: string): boolean {
  return techniqueVideos.some(v => v.technique_id === techniqueId);
}

/**
 * Get video count stats
 */
export function getVideoStats() {
  const uniqueTechniques = getTechniqueIdsWithVideos();
  const byInstructor = techniqueVideos.reduce((acc, v) => {
    acc[v.instructor] = (acc[v.instructor] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalVideos: techniqueVideos.length,
    techniquesWithVideos: uniqueTechniques.length,
    byInstructor,
  };
}

// ===========================================
// POSITION MAPPING
// ===========================================

/**
 * Map technique ID prefix to position category
 */
export function getTechniquePosition(techniqueId: string): PositionCategory {
  const prefix = techniqueId.substring(0, 2);
  const mapping: Record<string, PositionCategory> = {
    // Technical positions
    'CG': 'closed_guard',
    'HG': 'half_guard',
    'OG': 'open_guard',
    'MT': 'mount',
    'SC': 'side_control',
    'BC': 'back_control',
    'NS': 'north_south',
    'TT': 'turtle',
    'TD': 'takedowns',
    'CL': 'clinch',
    'GP': 'guard_passing',
    'KB': 'knee_on_belly',
    'SM': 'submissions',
    'TR': 'transitions',
    // Mindset & lifestyle categories
    'BJ': 'belt_journey',
    'MG': 'mental_game',
    'AL': 'age_longevity',
    'LB': 'lifestyle',
    'IR': 'injury_recovery',
  };
  return mapping[prefix] || 'transitions';
}

/**
 * Human-readable position names
 */
export const positionNames: Record<PositionCategory, string> = {
  // Technical positions
  closed_guard: 'Closed Guard',
  half_guard: 'Half Guard',
  open_guard: 'Open Guard',
  mount: 'Mount',
  side_control: 'Side Control',
  back_control: 'Back Control',
  north_south: 'North-South',
  turtle: 'Turtle',
  takedowns: 'Takedowns',
  clinch: 'Clinch',
  guard_passing: 'Guard Passing',
  knee_on_belly: 'Knee on Belly',
  submissions: 'Submissions',
  transitions: 'Transitions',
  // Mindset & lifestyle categories
  belt_journey: 'Belt Journey',
  mental_game: 'Mental Game',
  age_longevity: 'Age & Longevity',
  lifestyle: 'Lifestyle',
  injury_recovery: 'Injury & Recovery',
};

// ===========================================
// RECOMMENDATION ENGINE
// ===========================================

interface UserTrainingData {
  recentStruggles: string[];       // Technique IDs from recent sessions
  plateauedTechniques: string[];   // Stuck at developing for 3+ weeks
  beltLevel: BeltLevel;
  techniqueProgress: Map<string, { proficiency: ProficiencyLevel; lastPracticed: string | null }>;
  trainingGoals: string[];         // e.g., "guard retention", "submissions"
}

/**
 * Get reason text for recommendation
 */
function getReasonText(reason: RecommendationReason, techniqueName: string): string {
  const texts: Record<RecommendationReason, string> = {
    recent_struggle: `You mentioned difficulty with ${techniqueName} in recent sessions. This video can help.`,
    plateau_technique: `${techniqueName} has been at "developing" for a while. Review the fundamentals to break through.`,
    belt_level_gap: `${techniqueName} is a core technique for your belt level that needs attention.`,
    chain_completion: `Learning ${techniqueName} will complete a technique chain you're building.`,
    fundamentals_refresh: `It's been a while since you practiced ${techniqueName}. A quick refresh can help.`,
    next_progression: `Based on what you've mastered, ${techniqueName} is a natural next step.`,
    training_focus: `${techniqueName} aligns with your training goals.`,
  };
  return texts[reason];
}

/**
 * Generate "For You" video recommendations
 */
export function generateRecommendations(
  userData: UserTrainingData,
  maxRecommendations: number = 5
): ForYouSection {
  const recommendations: VideoRecommendation[] = [];
  const usedTechniqueIds = new Set<string>();

  // Priority 1: Recent struggles
  for (const techniqueId of userData.recentStruggles) {
    if (usedTechniqueIds.has(techniqueId)) continue;
    const videos = getVideosForTechnique(techniqueId);
    if (videos.instructional.length > 0) {
      const video = videos.instructional[0];
      const progress = userData.techniqueProgress.get(techniqueId);
      recommendations.push({
        video,
        technique_name: video.title,
        position_category: positionNames[getTechniquePosition(techniqueId)],
        reason: 'recent_struggle',
        reason_text: getReasonText('recent_struggle', video.title),
        priority: 'high',
        user_proficiency: progress?.proficiency || null,
        times_practiced: 0,
        last_practiced: progress?.lastPracticed || null,
      });
      usedTechniqueIds.add(techniqueId);
    }
  }

  // Priority 2: Plateaued techniques
  for (const techniqueId of userData.plateauedTechniques) {
    if (usedTechniqueIds.has(techniqueId)) continue;
    const videos = getVideosForTechnique(techniqueId);
    if (videos.instructional.length > 0) {
      const video = videos.instructional[0];
      const progress = userData.techniqueProgress.get(techniqueId);
      recommendations.push({
        video,
        technique_name: video.title,
        position_category: positionNames[getTechniquePosition(techniqueId)],
        reason: 'plateau_technique',
        reason_text: getReasonText('plateau_technique', video.title),
        priority: 'high',
        user_proficiency: progress?.proficiency || null,
        times_practiced: 0,
        last_practiced: progress?.lastPracticed || null,
      });
      usedTechniqueIds.add(techniqueId);
    }
  }

  // Priority 3: Fill with belt-level techniques not yet proficient
  const allTechniqueIds = getTechniqueIdsWithVideos();
  for (const techniqueId of allTechniqueIds) {
    if (recommendations.length >= maxRecommendations) break;
    if (usedTechniqueIds.has(techniqueId)) continue;

    const progress = userData.techniqueProgress.get(techniqueId);
    if (!progress || progress.proficiency !== 'proficient') {
      const videos = getVideosForTechnique(techniqueId);
      if (videos.instructional.length > 0) {
        const video = videos.instructional[0];
        recommendations.push({
          video,
          technique_name: video.title,
          position_category: positionNames[getTechniquePosition(techniqueId)],
          reason: 'belt_level_gap',
          reason_text: getReasonText('belt_level_gap', video.title),
          priority: 'medium',
          user_proficiency: progress?.proficiency || null,
          times_practiced: 0,
          last_practiced: progress?.lastPracticed || null,
        });
        usedTechniqueIds.add(techniqueId);
      }
    }
  }

  return {
    recommendations: recommendations.slice(0, maxRecommendations),
    generated_at: new Date().toISOString(),
    based_on_sessions: 0, // Would come from session analysis
    user_belt: userData.beltLevel,
  };
}

// ===========================================
// MOCK DATA FOR TESTING
// ===========================================

/**
 * Mock "For You" recommendations for demo
 */
export const mockForYouSection: ForYouSection = {
  recommendations: [
    {
      video: techniqueVideos.find(v => v.technique_id === 'SC_016')!,
      technique_name: 'Side Control Escape',
      position_category: 'Side Control',
      reason: 'recent_struggle',
      reason_text: 'You mentioned difficulty with side control escapes in your last 3 sessions. This comprehensive guide covers the fundamentals.',
      priority: 'high',
      user_proficiency: 'developing',
      times_practiced: 12,
      last_practiced: '2024-12-18',
    },
    {
      video: techniqueVideos.find(v => v.technique_id === 'CG_008')!,
      technique_name: 'Triangle Choke',
      position_category: 'Closed Guard',
      reason: 'plateau_technique',
      reason_text: 'Triangle choke has been at "developing" for 3 weeks. Review the angle and leg positioning details.',
      priority: 'high',
      user_proficiency: 'developing',
      times_practiced: 18,
      last_practiced: '2024-12-15',
    },
    {
      video: techniqueVideos.find(v => v.technique_id === 'GP_024')!,
      technique_name: 'Guard Passing Concepts',
      position_category: 'Guard Passing',
      reason: 'belt_level_gap',
      reason_text: 'Guard passing is a core skill for blue belt. This conceptual overview will help you understand the bigger picture.',
      priority: 'medium',
      user_proficiency: 'learning',
      times_practiced: 5,
      last_practiced: '2024-12-10',
    },
    {
      video: techniqueVideos.find(v => v.technique_id === 'BC_005')!,
      technique_name: 'Rear Naked Choke',
      position_category: 'Back Control',
      reason: 'chain_completion',
      reason_text: 'You\'re getting better at taking the back. Adding a solid RNC finish will complete your back attack chain.',
      priority: 'medium',
      user_proficiency: 'proficient',
      times_practiced: 28,
      last_practiced: '2024-12-19',
    },
    {
      video: techniqueVideos.find(v => v.technique_id === 'HG_001')!,
      technique_name: 'Half Guard Fundamentals',
      position_category: 'Half Guard',
      reason: 'fundamentals_refresh',
      reason_text: 'It\'s been 30+ days since you practiced half guard. A quick refresh on the fundamentals can help.',
      priority: 'low',
      user_proficiency: 'proficient',
      times_practiced: 35,
      last_practiced: '2024-11-15',
    },
  ],
  generated_at: new Date().toISOString(),
  based_on_sessions: 47,
  user_belt: 'blue',
};
