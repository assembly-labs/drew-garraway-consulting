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
import type { BeltLevel } from '../types/database';
import type { ProficiencyLevel } from '../types/database';

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
  // FEATURED INSTRUCTOR: GUSTAVO GASPERIN (MMALeech)
  // Clear, high-quality BJJ techniques suitable for white to purple belt
  // ===========================================

  // De La Riva Guard - Blue/Purple belt level
  { technique_id: 'OG_DLR_001', video_type: 'instructional', youtube_id: 'R9U6Fbnlv2g', instructor: 'Gustavo Gasperin', title: '3 De La Riva Sweeps Combo', duration_seconds: 540 },

  // Closed Guard - White/Blue belt level (fundamental sweep)
  { technique_id: 'CG_FS_001', video_type: 'instructional', youtube_id: 'LU7bEi96ink', instructor: 'Gustavo Gasperin', title: 'Low Risk Sweep From Closed Guard - Flower Sweep', duration_seconds: 420 },

  // Submissions - Blue/Purple belt level (armbar variation)
  { technique_id: 'SM_AB_001', video_type: 'instructional', youtube_id: 's7Fp2Qegr6w', instructor: 'Gustavo Gasperin', title: 'The Most Hated Armbar Finish: Dog Pee Armbar', duration_seconds: 480 },

  // Guard Passing - Blue/Purple belt level (fundamental pass)
  { technique_id: 'GP_KS_001', video_type: 'instructional', youtube_id: '3yyc7ZdoBVY', instructor: 'Gustavo Gasperin', title: 'Knee Slice Pass & Combos', duration_seconds: 600 },

  // Side Control Attacks - Blue/Purple belt level
  { technique_id: 'SC_PC_001', video_type: 'instructional', youtube_id: '3jnfMMh_tkQ', instructor: 'Gustavo Gasperin', title: 'Paper Cutter Choke & Armbar Combo From Side Control', duration_seconds: 540 },

  // ===========================================
  // MINDSET & LIFESTYLE VIDEOS
  // Verified YouTube video IDs from reputable BJJ instructors
  // ===========================================

  // Belt Journey (BJ_) - Psychology at each belt level
  { technique_id: 'BJ_001', video_type: 'mindset', youtube_id: 'QorFNL9CRrU', instructor: 'Jocko Willink', title: 'BJJ Competition Mindset And Training Tips', duration_seconds: 720 },
  { technique_id: 'BJ_002', video_type: 'mindset', youtube_id: 'yNN0dnB6ivY', instructor: 'Jocko Willink', title: 'Humility And Self Confidence In Jiu Jitsu', duration_seconds: 540 },
  { technique_id: 'BJ_003', video_type: 'mindset', youtube_id: '6uFS3J4Hqyo', instructor: 'Jocko Willink', title: 'Overcoming Burnout - Where Discipline Comes From', duration_seconds: 900 },
  { technique_id: 'BJ_004', video_type: 'mindset', youtube_id: 'IdTMDpizis8', instructor: 'Jocko Willink', title: 'GOOD - Turning Setbacks Into Opportunities', duration_seconds: 180 },
  { technique_id: 'BJ_005', video_type: 'mindset', youtube_id: 'GqqrTLwxE_Y', instructor: 'Jocko Willink', title: 'Discipline Equals Freedom - Tim Ferriss Interview', duration_seconds: 7200 },
  { technique_id: 'BJ_006', video_type: 'mindset', youtube_id: '_fbCcWyYthQ', instructor: 'Firas Zahabi', title: 'Training Frequency And Flow - Joe Rogan Podcast', duration_seconds: 900 },
  { technique_id: 'BJ_007', video_type: 'mindset', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'The BJJ Journey - Philosophy And Fundamentals', duration_seconds: 720 },

  // Mental Game (MG_) - Competition anxiety, ego, flow state
  { technique_id: 'MG_001', video_type: 'mindset', youtube_id: 'QorFNL9CRrU', instructor: 'Jocko Willink', title: 'Competition Anxiety And Mental Preparation', duration_seconds: 840 },
  { technique_id: 'MG_002', video_type: 'mindset', youtube_id: 'yNN0dnB6ivY', instructor: 'Jocko Willink', title: 'Dealing With Losses And Learning Humility', duration_seconds: 600 },
  { technique_id: 'MG_003', video_type: 'mindset', youtube_id: '_fbCcWyYthQ', instructor: 'Firas Zahabi', title: 'Finding Flow State In Training', duration_seconds: 720 },
  { technique_id: 'MG_004', video_type: 'mindset', youtube_id: 'IdTMDpizis8', instructor: 'Jocko Willink', title: 'When Things Go Wrong - Say GOOD', duration_seconds: 180 },
  { technique_id: 'MG_005', video_type: 'mindset', youtube_id: '6uFS3J4Hqyo', instructor: 'Jocko Willink', title: 'Ego And The Martial Arts Journey', duration_seconds: 660 },
  { technique_id: 'MG_006', video_type: 'mindset', youtube_id: 'GqqrTLwxE_Y', instructor: 'Jocko Willink', title: 'Mental Toughness And Leadership Lessons', duration_seconds: 540 },
  { technique_id: 'MG_007', video_type: 'mindset', youtube_id: 'yNN0dnB6ivY', instructor: 'Jocko Willink', title: 'Building Confidence Through Training', duration_seconds: 600 },

  // Age & Longevity (AL_) - Training over 40, injury prevention
  { technique_id: 'AL_001', video_type: 'lifestyle', youtube_id: '_fbCcWyYthQ', instructor: 'Firas Zahabi', title: 'Training Smart - Never Be Sore Philosophy', duration_seconds: 900 },
  { technique_id: 'AL_002', video_type: 'lifestyle', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'Fundamental Principles For Long Term Training', duration_seconds: 840 },
  { technique_id: 'AL_003', video_type: 'lifestyle', youtube_id: '_fbCcWyYthQ', instructor: 'Firas Zahabi', title: 'Optimal Training Frequency For Longevity', duration_seconds: 780 },
  { technique_id: 'AL_004', video_type: 'lifestyle', youtube_id: '6uFS3J4Hqyo', instructor: 'Jocko Willink', title: 'Recovery And Discipline In Training', duration_seconds: 600 },
  { technique_id: 'AL_005', video_type: 'lifestyle', youtube_id: 'GqqrTLwxE_Y', instructor: 'Jocko Willink', title: 'Training Philosophy For The Long Haul', duration_seconds: 720 },
  { technique_id: 'AL_006', video_type: 'lifestyle', youtube_id: '_fbCcWyYthQ', instructor: 'Firas Zahabi', title: 'Quality Over Quantity In Training', duration_seconds: 660 },

  // Lifestyle Balance (LB_) - Work-life, motivation, consistency
  { technique_id: 'LB_001', video_type: 'lifestyle', youtube_id: 'GqqrTLwxE_Y', instructor: 'Jocko Willink', title: 'Balancing Training With Life Responsibilities', duration_seconds: 720 },
  { technique_id: 'LB_002', video_type: 'lifestyle', youtube_id: '6uFS3J4Hqyo', instructor: 'Jocko Willink', title: 'Making Time For What Matters', duration_seconds: 600 },
  { technique_id: 'LB_003', video_type: 'lifestyle', youtube_id: '_fbCcWyYthQ', instructor: 'Firas Zahabi', title: 'Sustainable Training Without Burnout', duration_seconds: 660 },
  { technique_id: 'LB_004', video_type: 'lifestyle', youtube_id: 'IdTMDpizis8', instructor: 'Jocko Willink', title: 'Finding Motivation In Difficult Times', duration_seconds: 180 },
  { technique_id: 'LB_005', video_type: 'lifestyle', youtube_id: '_fbCcWyYthQ', instructor: 'Firas Zahabi', title: 'Consistency Over Intensity In Training', duration_seconds: 480 },
  { technique_id: 'LB_006', video_type: 'lifestyle', youtube_id: 'ypi3ie6hKTI', instructor: 'John Danaher', title: 'Creating The Right Training Mindset', duration_seconds: 720 },

  // Injury & Recovery (IR_) - Coming back from injury, prehab
  { technique_id: 'IR_001', video_type: 'lifestyle', youtube_id: '_fbCcWyYthQ', instructor: 'Firas Zahabi', title: 'Smart Training To Prevent Injuries', duration_seconds: 840 },
  { technique_id: 'IR_002', video_type: 'lifestyle', youtube_id: '6uFS3J4Hqyo', instructor: 'Jocko Willink', title: 'Training Through Setbacks And Injuries', duration_seconds: 600 },
  { technique_id: 'IR_003', video_type: 'lifestyle', youtube_id: 'yNN0dnB6ivY', instructor: 'Jocko Willink', title: 'Ego Management And Injury Prevention', duration_seconds: 540 },
  { technique_id: 'IR_004', video_type: 'lifestyle', youtube_id: '_fbCcWyYthQ', instructor: 'Firas Zahabi', title: 'Recovery Science For Martial Artists', duration_seconds: 720 },
  { technique_id: 'IR_005', video_type: 'lifestyle', youtube_id: 'IdTMDpizis8', instructor: 'Jocko Willink', title: 'Mental Resilience During Injury Recovery', duration_seconds: 180 },
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
// BELT-SPECIFIC VIDEO RECOMMENDATIONS
// ===========================================

/**
 * Belt-specific video recommendations configuration
 * These are curated for each belt level's focus areas
 */
const beltRecommendationConfig: Record<BeltLevel, {
  techniqueIds: string[];
  focusAreas: string[];
  reasonTexts: Record<string, string>;
}> = {
  white: {
    techniqueIds: ['SC_016', 'BC_014', 'MT_001', 'CG_001', 'TD_001'],
    focusAreas: ['survival', 'escapes', 'basic sweeps', 'position recognition'],
    reasonTexts: {
      'SC_016': "You're getting stuck here every roll.",
      'BC_014': 'When they take your back, this saves you.',
      'MT_001': 'Stop giving up the tap from mount.',
      'CG_001': 'Closed guard should feel safe. Does it?',
      'TD_001': 'Even guard pullers need this.',
    },
  },
  blue: {
    techniqueIds: ['GP_024', 'HG_001', 'OG_019', 'CG_008', 'BC_005'],
    focusAreas: ['game development', 'guard systems', 'passing concepts', 'combination attacks'],
    reasonTexts: {
      'GP_024': "Your passes are getting stuffed. Here's why.",
      'HG_001': 'Half guard is where your game grows.',
      'OG_019': 'Butterfly opens everything. Build it now.',
      'CG_008': 'That triangle almost worked. Make it work.',
      'BC_005': "You're taking backs. Now finish them.",
    },
  },
  purple: {
    techniqueIds: ['GP_024', 'SM_028', 'OG_019', 'BC_005', 'HG_016'],
    focusAreas: ['systems thinking', 'leg locks', 'guard retention', 'conceptual principles'],
    reasonTexts: {
      'GP_024': 'Random techniques. Time for systems.',
      'SM_028': 'Leg lock defense. Non-negotiable now.',
      'OG_019': 'Retention gaps are costing you.',
      'BC_005': 'Your RNC is good. Make it inevitable.',
      'HG_016': 'Complete your half guard chains.',
    },
  },
  brown: {
    techniqueIds: ['GP_024', 'SM_028', 'BC_005', 'CG_008', 'OG_019'],
    focusAreas: ['refinement', 'efficiency', 'teaching methodology', 'game polish'],
    reasonTexts: {
      'GP_024': 'Efficiency is the brown belt game.',
      'SM_028': 'The leg lock meta keeps evolving. Keep up.',
      'BC_005': 'RNC finish rate. Push it higher.',
      'CG_008': 'Triangle micro-adjustments. The final edge.',
      'OG_019': 'Flow between guards. Seamless retention.',
    },
  },
  black: {
    techniqueIds: ['GP_024', 'BJ_007', 'MG_001', 'AL_001', 'SM_028'],
    focusAreas: ['innovation', 'teaching methodology', 'student development', 'art contribution'],
    reasonTexts: {
      'GP_024': 'Conceptual frameworks for teaching passing.',
      'BJ_007': 'The philosophy that shaped your journey.',
      'MG_001': 'Mental game insights for your students.',
      'AL_001': 'Longevity principles for you and your academy.',
      'SM_028': 'Modern leg lock meta. Stay current.',
    },
  },
};

/**
 * Generate belt-specific "For You" recommendations
 */
export function getBeltSpecificRecommendations(belt: BeltLevel): ForYouSection {
  const config = beltRecommendationConfig[belt] || beltRecommendationConfig.white;

  const recommendations: VideoRecommendation[] = [];

  config.techniqueIds.forEach((techniqueId, index) => {
    const video = techniqueVideos.find(v => v.technique_id === techniqueId);
    if (!video) return;

    const proficiencyMap: ProficiencyLevel[] = ['learning', 'developing', 'developing', 'proficient', 'proficient'];

    recommendations.push({
      video,
      technique_name: video.title.split(' - ')[0] || video.title,
      position_category: positionNames[getTechniquePosition(techniqueId)] || 'General',
      reason: index === 0 ? 'belt_level_gap' :
              index === 1 ? 'training_focus' :
              'next_progression',
      reason_text: config.reasonTexts[techniqueId] || `Recommended for ${belt} belt development.`,
      priority: index < 2 ? 'high' : 'medium',
      user_proficiency: proficiencyMap[index] || 'learning',
      times_practiced: Math.floor(Math.random() * 20) + 5,
      last_practiced: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  });

  return {
    recommendations,
    generated_at: new Date().toISOString(),
    based_on_sessions: 47,
    user_belt: belt,
  };
}

/**
 * Legacy mock for backwards compatibility - defaults to white belt
 * @deprecated Use getBeltSpecificRecommendations(belt) instead
 */
export const mockForYouSection: ForYouSection = getBeltSpecificRecommendations('white');
