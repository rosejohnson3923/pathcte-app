-- Pathket Explore Careers Question Sets (Scenario-Based)
-- Generated: 2025-11-06T00:30:58.720Z
-- Replace TEACHER_ID_HERE with actual teacher UUID
-- NOTE: career_id values are placeholders. Replace with actual career UUIDs from your database

-- ============================================================
-- Explore Careers Set 1: Game Designer - Career Exploration
-- ============================================================

WITH new_set AS (
  INSERT INTO question_sets (
    creator_id, title, description, subject, career_sector,
    grade_level, difficulty_level, tags, is_public, is_verified, total_questions,
    career_id, question_set_type
  ) VALUES (
    'TEACHER_ID_HERE',
    'Game Designer - Career Exploration',
    'Experience the Game Designer career through realistic workplace scenarios and decisions',
    'Arts & Entertainment',
    'Arts & Entertainment',
    ARRAY[],
    'medium',
    ARRAY['explore_careers', 'game_designer', 'arts & entertainment', 'scenario_based'],
    true,
    false,
    12,
    (SELECT id FROM careers WHERE title = 'Game Designer' LIMIT 1), -- Find career by title
    'explore_careers'
  ) RETURNING id
)
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) SELECT
  (SELECT id FROM new_set),
  'You are a Game Designer working with a team of developers and artists on a new game. One of the programmers is frustrated because your proposed game mechanic is difficult to implement with existing code. What do you do?',
  'multiple_choice',
  '[{"text":"Collaborate with the programmer to revise the mechanic while ensuring the core idea is preserved.","is_correct":true},{"text":"Insist on implementing the mechanic as it is and ask the programmer to figure it out.","is_correct":false},{"text":"Ignore the programmer''s concerns and continue designing the rest of the game.","is_correct":false},{"text":"Ask the artist for input without addressing the programmer''s concerns.","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'medium',
  'people'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a Game Designer leading a brainstorming session with your team. The artists feel their ideas aren''t being considered, and tension is building. What do you do?',
  'multiple_choice',
  '[{"text":"Pause the session, encourage open dialogue, and ensure everyone''s ideas are heard.","is_correct":true},{"text":"Push forward with your own ideas and avoid addressing the tension.","is_correct":false},{"text":"Let the programmers dominate the discussion since their input is more critical.","is_correct":false},{"text":"End the session early and decide the direction yourself.","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium',
  'people'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a Game Designer playtesting a prototype level. Players consistently fail to understand how to interact with a key game mechanic. What do you do?',
  'multiple_choice',
  '[{"text":"Redesign the mechanic to make its purpose and interaction more intuitive.","is_correct":true},{"text":"Add a lengthy tutorial explaining the mechanic.","is_correct":false},{"text":"Leave the mechanic as-is and assume players will eventually figure it out.","is_correct":false},{"text":"Remove the mechanic entirely to simplify gameplay.","is_correct":false}]'::jsonb,
  45,
  15,
  2,
  'hard',
  'product'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a Game Designer tasked with improving the game''s visuals without changing its performance requirements. The artists want to add complex animations that could impact frame rates. What do you do?',
  'multiple_choice',
  '[{"text":"Work with the artists to create visually appealing animations that maintain performance efficiency.","is_correct":true},{"text":"Approve the animations despite the performance risks because they look great.","is_correct":false},{"text":"Reject all animation ideas to prioritize performance entirely.","is_correct":false},{"text":"Delay the decision until the game is nearly complete.","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'medium',
  'product'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a Game Designer reviewing the budget for your project''s sound design. The team suggests hiring an expensive composer for the soundtrack, but this could significantly reduce the budget for other areas. What do you do?',
  'multiple_choice',
  '[{"text":"Look for a composer within budget and ensure other areas aren''t compromised.","is_correct":true},{"text":"Approve the expensive composer without considering the impact on other areas.","is_correct":false},{"text":"Decrease funding for game mechanics to make room for the composer.","is_correct":false},{"text":"Eliminate any soundtrack to save money.","is_correct":false}]'::jsonb,
  45,
  15,
  4,
  'hard',
  'pricing'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a Game Designer estimating costs for your game''s asset creation. You have limited time and resources but need high-quality assets. What do you do?',
  'multiple_choice',
  '[{"text":"Prioritize core assets and outsource secondary ones to balance quality and budget.","is_correct":true},{"text":"Spend the entire budget on a few high-quality assets, even if the rest suffer.","is_correct":false},{"text":"Use free assets from the internet regardless of their quality.","is_correct":false},{"text":"Delay asset creation to wait for a bigger budget later.","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'medium',
  'pricing'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a Game Designer creating workflows for your team. The art team struggles to meet deadlines because their tasks are poorly organized. What do you do?',
  'multiple_choice',
  '[{"text":"Revise the workflow to better allocate time and resources for the art team.","is_correct":true},{"text":"Ignore the workflow issues and ask the team to work faster.","is_correct":false},{"text":"Leave the team to fix the workflow problems themselves.","is_correct":false},{"text":"Shift deadlines for all teams without addressing the root cause.","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium',
  'process'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a Game Designer working on a strict deadline. A programmer encounters a bug in the game engine that could delay the project. What do you do?',
  'multiple_choice',
  '[{"text":"Reorganize the schedule to give the programmer time to fix the bug without compromising other deadlines.","is_correct":true},{"text":"Ask the programmer to skip fixing the bug to stay on schedule.","is_correct":false},{"text":"Assign the bug fix to another teammate, even if they lack the expertise to resolve it.","is_correct":false},{"text":"Ignore the bug and continue with development as planned.","is_correct":false}]'::jsonb,
  45,
  15,
  7,
  'hard',
  'process'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a Game Designer presenting your work at a gaming convention. A publisher is impressed and wants to discuss future collaboration. What do you do?',
  'multiple_choice',
  '[{"text":"Exchange contact information and follow up after the convention to explore opportunities.","is_correct":true},{"text":"Immediately promise to work with them without discussing details.","is_correct":false},{"text":"Ignore the opportunity and focus on the current game.","is_correct":false},{"text":"Request financial backing on the spot without discussing the specifics.","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'medium',
  'proceeds'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a Game Designer seeking ways to grow your career. A senior designer offers to mentor you, but it requires additional hours outside work. What do you do?',
  'multiple_choice',
  '[{"text":"Accept the mentorship and commit to learning from their expertise.","is_correct":true},{"text":"Decline the mentorship because of the extra hours required.","is_correct":false},{"text":"Accept the mentorship but fail to dedicate enough effort.","is_correct":false},{"text":"Insist on mentorship during work hours only.","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'medium',
  'proceeds'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a Game Designer deciding whether to pursue a certification in advanced game design software. The course is expensive but could enhance your skill set and career prospects. What do you do?',
  'multiple_choice',
  '[{"text":"Invest in the certification to improve your skills and long-term career opportunities.","is_correct":true},{"text":"Skip the certification and continue using basic tools.","is_correct":false},{"text":"Take the certification but ignore applying the skills in your work.","is_correct":false},{"text":"Delay the certification indefinitely until costs decrease.","is_correct":false}]'::jsonb,
  45,
  15,
  10,
  'hard',
  'profits'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a Game Designer asked to implement monetization in your game. Your team proposes a pay-to-win model, but you’re worried it could alienate players. What do you do?',
  'multiple_choice',
  '[{"text":"Suggest a fair monetization model like cosmetic upgrades without affecting gameplay balance.","is_correct":true},{"text":"Approve the pay-to-win model for maximum profit.","is_correct":false},{"text":"Remove monetization entirely and leave the game free.","is_correct":false},{"text":"Delay the decision to focus on other aspects of the game.","is_correct":false}]'::jsonb,
  45,
  15,
  11,
  'hard',
  'profits'
;

-- ============================================================
-- Explore Careers Set 2: Esports Player - Career Exploration
-- ============================================================

WITH new_set AS (
  INSERT INTO question_sets (
    creator_id, title, description, subject, career_sector,
    grade_level, difficulty_level, tags, is_public, is_verified, total_questions,
    career_id, question_set_type
  ) VALUES (
    'TEACHER_ID_HERE',
    'Esports Player - Career Exploration',
    'Experience the Esports Player career through realistic workplace scenarios and decisions',
    'Arts & Entertainment',
    'Arts & Entertainment',
    ARRAY[],
    'medium',
    ARRAY['explore_careers', 'esports_player', 'arts & entertainment', 'scenario_based'],
    true,
    false,
    12,
    (SELECT id FROM careers WHERE title = 'Esports Player' LIMIT 1), -- Find career by title
    'explore_careers'
  ) RETURNING id
)
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) SELECT
  (SELECT id FROM new_set),
  'You are an Esports Player on a professional team preparing for a major tournament. One of your teammates is struggling to master a key strategy, and it’s impacting the team''s practice sessions. What do you do?',
  'multiple_choice',
  '[{"text":"Offer to help your teammate by reviewing the strategy together and providing constructive feedback.","is_correct":true},{"text":"Ignore the issue and focus on your own practice to ensure your performance is top-notch.","is_correct":false},{"text":"Criticize your teammate in front of the team to pressure them into improving.","is_correct":false},{"text":"Ask the coach to replace the struggling teammate with someone more experienced.","is_correct":false}]'::jsonb,
  45,
  10,
  0,
  'medium',
  'people'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are competing in a live tournament match, and a teammate makes a crucial mistake, costing an important round. They seem visibly upset and shaken. What do you do?',
  'multiple_choice',
  '[{"text":"Encourage your teammate, reassure them that mistakes happen, and refocus the team''s energy on the next round.","is_correct":true},{"text":"Call out the mistake loudly so the team knows who is at fault.","is_correct":false},{"text":"Stay silent and let the coach handle the situation after the match.","is_correct":false},{"text":"Avoid addressing the issue and pretend it didn’t happen so the team can move on.","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium',
  'people'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are practicing for an upcoming event, but you notice that your gaming equipment (mouse, keyboard, etc.) is malfunctioning and affecting your accuracy. What do you do?',
  'multiple_choice',
  '[{"text":"Report the issue to your team manager and request replacement equipment immediately.","is_correct":true},{"text":"Continue practicing with the malfunctioning equipment because you don’t want to cause a delay.","is_correct":false},{"text":"Try to fix the equipment yourself, even though you''re not trained to repair it.","is_correct":false},{"text":"Use a teammate''s equipment during practice, even if it disrupts their session.","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'easy',
  'product'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'During a key match, you realize that the team’s current strategy isn’t working against the opponent. What do you do?',
  'multiple_choice',
  '[{"text":"Communicate with your team during a short break to suggest adjusting the strategy based on the opponent''s playstyle.","is_correct":true},{"text":"Stick to the original plan since it’s too risky to make changes mid-game.","is_correct":false},{"text":"Focus on your own performance and let the coach handle the strategy.","is_correct":false},{"text":"Blame your teammates for their poor execution of the strategy.","is_correct":false}]'::jsonb,
  45,
  15,
  3,
  'medium',
  'product'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'Your team has been offered a sponsorship deal from a gaming equipment company. However, the deal is significantly lower than what you expected. What do you do?',
  'multiple_choice',
  '[{"text":"Discuss with your manager and teammates to negotiate for a better deal before signing.","is_correct":true},{"text":"Accept the deal immediately, as any sponsorship is better than none.","is_correct":false},{"text":"Reject the deal completely without discussing it with your team.","is_correct":false},{"text":"Agree to the deal and hope you can renegotiate later.","is_correct":false}]'::jsonb,
  45,
  15,
  4,
  'medium',
  'pricing'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'Your team is planning a training bootcamp in another city to prepare for a major tournament. However, the budget for the trip is tight, and you have to make adjustments. What do you do?',
  'multiple_choice',
  '[{"text":"Suggest staying in budget accommodations and limiting meals to simple options to save money.","is_correct":true},{"text":"Insist on staying at a luxury hotel to ensure comfort during training.","is_correct":false},{"text":"Cancel the bootcamp completely to avoid overspending.","is_correct":false},{"text":"Ask the team owner to personally fund the entire trip without making adjustments.","is_correct":false}]'::jsonb,
  45,
  10,
  5,
  'medium',
  'pricing'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are an Esports Player preparing for a major tournament. You realize the team’s practice schedule isn’t as efficient as it could be. What do you do?',
  'multiple_choice',
  '[{"text":"Analyze the schedule and suggest changes that allow for more focused practice and breaks.","is_correct":true},{"text":"Stick to the current schedule, assuming the coach knows what’s best.","is_correct":false},{"text":"Skip parts of the schedule that you feel are not helpful and focus on your own practice.","is_correct":false},{"text":"Complain to your teammates about the schedule but don''t address it with the coach.","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium',
  'process'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'During a tournament, your match is delayed, and you have limited time to recover between games. What do you do to stay focused?',
  'multiple_choice',
  '[{"text":"Use the delay to take a short break, hydrate, and mentally prepare for the next game.","is_correct":true},{"text":"Keep practicing non-stop during the delay to stay sharp.","is_correct":false},{"text":"Use the delay to browse social media and relax.","is_correct":false},{"text":"Complain about the delay and argue with the event staff.","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'easy',
  'process'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'A well-known gaming influencer invites you to collaborate on a stream. This could increase your visibility as a player, but it would mean taking time away from your practice schedule. What do you do?',
  'multiple_choice',
  '[{"text":"Discuss with your coach and teammates to see how this opportunity could fit with the team''s schedule.","is_correct":true},{"text":"Decline the invitation because your practice schedule is more important than networking opportunities.","is_correct":false},{"text":"Accept the invitation without consulting your team, as it''s your personal career opportunity.","is_correct":false},{"text":"Ignore the invitation because you’re unsure how it would impact your team responsibilities.","is_correct":false}]'::jsonb,
  45,
  15,
  8,
  'hard',
  'proceeds'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You’ve been invited to join a new team with a higher salary but less experienced teammates. Staying with your current team might give you better chances of winning tournaments. What do you do?',
  'multiple_choice',
  '[{"text":"Weigh the long-term potential of both teams and consult with trusted mentors before making a decision.","is_correct":true},{"text":"Immediately accept the offer because it pays a higher salary.","is_correct":false},{"text":"Stay with your current team because you don’t want to risk switching teams.","is_correct":false},{"text":"Decline the offer without considering the details because you’re comfortable where you are.","is_correct":false}]'::jsonb,
  60,
  20,
  9,
  'hard',
  'proceeds'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You have been offered an opportunity to take a certification course in advanced gaming strategies. The course is expensive, and you will have to use some of your savings to pay for it. What do you do?',
  'multiple_choice',
  '[{"text":"Invest in the course because it could help you improve your skills and advance your career.","is_correct":true},{"text":"Skip the course and focus on free online videos instead.","is_correct":false},{"text":"Ask your team to pay for the course and refuse to take it if they won’t.","is_correct":false},{"text":"Avoid taking the course because it’s expensive and you might not see a return on investment.","is_correct":false}]'::jsonb,
  45,
  15,
  10,
  'medium',
  'profits'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'During a match, one of the opposing players accuses your team of cheating without evidence. What do you do?',
  'multiple_choice',
  '[{"text":"Remain calm and let the tournament organizers handle the accusation.","is_correct":true},{"text":"Publicly argue with the opposing player to defend your team’s reputation.","is_correct":false},{"text":"Ignore the accusation and continue playing without addressing it.","is_correct":false},{"text":"Respond with a counter-accusation to shift the focus away from your team.","is_correct":false}]'::jsonb,
  30,
  10,
  11,
  'medium',
  'profits'
;

-- ============================================================
-- Explore Careers Set 3: 3D Artist - Career Exploration
-- ============================================================

WITH new_set AS (
  INSERT INTO question_sets (
    creator_id, title, description, subject, career_sector,
    grade_level, difficulty_level, tags, is_public, is_verified, total_questions,
    career_id, question_set_type
  ) VALUES (
    'TEACHER_ID_HERE',
    '3D Artist - Career Exploration',
    'Experience the 3D Artist career through realistic workplace scenarios and decisions',
    'Arts & Entertainment',
    'Arts & Entertainment',
    ARRAY[],
    'medium',
    ARRAY['explore_careers', '3d_artist', 'arts & entertainment', 'scenario_based'],
    true,
    false,
    12,
    (SELECT id FROM careers WHERE title = '3D Artist' LIMIT 1), -- Find career by title
    'explore_careers'
  ) RETURNING id
)
INSERT INTO questions (
  question_set_id, question_text, question_type, options,
  time_limit_seconds, points, order_index, difficulty, business_driver
) SELECT
  (SELECT id FROM new_set),
  'You are a 3D Artist working on a team project to create character assets for a new video game. A game designer provides feedback on your model, suggesting changes that would impact your timeline. What do you do?',
  'multiple_choice',
  '[{"text":"Explain the potential timeline impact and propose a compromise to address the feedback within the project''s constraints.","is_correct":true},{"text":"Ignore the feedback and stick to the original design to meet your timeline goal.","is_correct":false},{"text":"Accept all the feedback and make changes immediately, even if they delay your deliverables.","is_correct":false},{"text":"Ask your manager to handle the feedback and avoid a direct conversation.","is_correct":false}]'::jsonb,
  30,
  10,
  0,
  'medium',
  'people'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a 3D Artist collaborating remotely with a team of animators. One of the animators raises concerns about your models not being properly rigged for their animation needs. How do you respond?',
  'multiple_choice',
  '[{"text":"Set up a meeting with the animator to understand their concerns and ensure your rigging meets their requirements.","is_correct":true},{"text":"Assume the animator can adjust the models themselves and continue as planned.","is_correct":false},{"text":"Defend your rigging approach and suggest they find solutions on their end.","is_correct":false},{"text":"Ignore the feedback since the animator''s concerns are unrelated to your role as a 3D Artist.","is_correct":false}]'::jsonb,
  30,
  10,
  1,
  'medium',
  'people'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a 3D Artist tasked with creating a high-quality character model for a client. While working, you notice the character''s texture doesn''t align properly when applied. What do you do?',
  'multiple_choice',
  '[{"text":"Pause to fix the alignment issue, ensuring the best quality before submitting the model.","is_correct":true},{"text":"Submit the model as it is and hope the client doesn''t notice the issue.","is_correct":false},{"text":"Use a workaround to stretch the texture without addressing the root cause.","is_correct":false},{"text":"Suggest to the client that they approve the model without textures to save time.","is_correct":false}]'::jsonb,
  30,
  10,
  2,
  'medium',
  'product'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a 3D Artist designing props for a game environment. The software you''re using crashes frequently, slowing your progress. What do you do?',
  'multiple_choice',
  '[{"text":"Switch to another reliable software and ensure compatibility before continuing your work.","is_correct":true},{"text":"Continue using the crashing software and save your work every few minutes.","is_correct":false},{"text":"Delay work until the software updates to fix the crashes.","is_correct":false},{"text":"Contact your team and ask them to complete your work on their software instead.","is_correct":false}]'::jsonb,
  30,
  10,
  3,
  'medium',
  'product'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a 3D Artist working with a limited budget on a character design for a game. Purchasing high-quality textures would exceed the budget. What do you do?',
  'multiple_choice',
  '[{"text":"Create your own textures or use free resources to stay within budget.","is_correct":true},{"text":"Purchase the high-quality textures anyway and inform your manager later about the budget overrun.","is_correct":false},{"text":"Request additional funding from the client to purchase the textures.","is_correct":false},{"text":"Deliver the design without textures to save costs.","is_correct":false}]'::jsonb,
  30,
  10,
  4,
  'medium',
  'pricing'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a 3D Artist working freelance. A client asks for a redesign of a model, but their budget doesn''t cover additional revisions. What do you do?',
  'multiple_choice',
  '[{"text":"Explain the cost implications and offer a discounted rate for the revision.","is_correct":true},{"text":"Complete the revision for free to maintain the client relationship.","is_correct":false},{"text":"Refuse to do the redesign unless the client pays the full original price for the revision.","is_correct":false},{"text":"Delay the redesign until the client can pay more.","is_correct":false}]'::jsonb,
  30,
  10,
  5,
  'medium',
  'pricing'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a 3D Artist with a tight deadline for designing a game environment. You realize your current workflow is inefficient and slowing you down. What do you do?',
  'multiple_choice',
  '[{"text":"Quickly research and implement a new workflow to improve efficiency and stay on schedule.","is_correct":true},{"text":"Continue with the current workflow and accept some delays.","is_correct":false},{"text":"Contact your manager and request an extension to complete the project.","is_correct":false},{"text":"Abandon the deadline and prioritize quality over speed completely.","is_correct":false}]'::jsonb,
  30,
  10,
  6,
  'medium',
  'process'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a 3D Artist tasked with creating multiple props for a game. To maximize efficiency, you consider batch processing multiple models. What do you do?',
  'multiple_choice',
  '[{"text":"Plan your workflow and batch process the models to complete them quickly while maintaining quality.","is_correct":true},{"text":"Focus on one model at a time without considering batch processing to avoid confusion.","is_correct":false},{"text":"Rush all models simultaneously without a clear plan to finish as quickly as possible.","is_correct":false},{"text":"Delegate the task to another teammate to avoid managing multiple models yourself.","is_correct":false}]'::jsonb,
  30,
  10,
  7,
  'medium',
  'process'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a 3D Artist seeking to grow your career. A networking event is happening, but you''re also behind on a freelance project. What do you do?',
  'multiple_choice',
  '[{"text":"Prioritize the networking event, but plan your time to catch up on the project afterward.","is_correct":true},{"text":"Skip the networking event to focus solely on the freelance project.","is_correct":false},{"text":"Attend the networking event without addressing the project backlog.","is_correct":false},{"text":"Cancel the freelance project to free up time for networking.","is_correct":false}]'::jsonb,
  30,
  10,
  8,
  'medium',
  'proceeds'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a 3D Artist working full-time on a game studio team. An opportunity arises to pitch your personal project to higher-ups, but you''re unsure if it''s ready. What do you do?',
  'multiple_choice',
  '[{"text":"Refine your project and pitch it when you feel it''s ready, ensuring it meets professional standards.","is_correct":true},{"text":"Pitch the project immediately, regardless of quality, to seize the opportunity.","is_correct":false},{"text":"Ignore the opportunity and focus solely on your current work.","is_correct":false},{"text":"Ask a colleague to pitch the project on your behalf to avoid presenting it yourself.","is_correct":false}]'::jsonb,
  30,
  10,
  9,
  'medium',
  'proceeds'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a 3D Artist considering additional training in a new software program to stay competitive in your industry. The course costs $1,200, which is outside your current budget. What do you do?',
  'multiple_choice',
  '[{"text":"Research free and low-cost resources for learning the software and invest when financially feasible.","is_correct":true},{"text":"Ignore the need for training and rely on your current skill set.","is_correct":false},{"text":"Take out a loan to pay for the training immediately.","is_correct":false},{"text":"Request funding from your employer for the training, regardless of whether it aligns with their needs.","is_correct":false}]'::jsonb,
  30,
  10,
  10,
  'medium',
  'profits'
UNION ALL SELECT
  (SELECT id FROM new_set),
  'You are a 3D Artist overseeing a large freelance project. A client requests changes to a completed model that go against your artistic vision. Implementing these changes could make the model less appealing but meet the client''s preferences. What do you do?',
  'multiple_choice',
  '[{"text":"Consult with the client to understand their preferences and suggest compromises that align with both their vision and artistic quality.","is_correct":true},{"text":"Refuse to make the changes and insist that your artistic vision is final.","is_correct":false},{"text":"Make all requested changes without advising the client on the potential drawbacks.","is_correct":false},{"text":"Abandon the project entirely to protect your artistic integrity.","is_correct":false}]'::jsonb,
  30,
  10,
  11,
  'medium',
  'profits'
;
