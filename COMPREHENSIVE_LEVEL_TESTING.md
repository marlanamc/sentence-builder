# Comprehensive Sentence Builder Level Testing Guide

## Overview
This document provides a systematic approach to testing all 47 levels of the Sentence Builder game. Each level tests specific grammar concepts, patterns, and sentence structures.

## Testing Methodology

### For Each Level:
1. **Test Basic Correct Sentences** - Verify the level accepts properly formed sentences
2. **Test Incorrect Sentences** - Ensure the level correctly rejects malformed sentences
3. **Test Edge Cases** - Test boundary conditions and complex scenarios
4. **Test Grammar Rules** - Verify all grammar rules are properly enforced
5. **Test UI/UX** - Ensure the interface works correctly

### Grammar Categories Tested:
- **Present Tense** (Levels 1-7)
- **Past Tense** (Levels 8-14)
- **Future Tenses** (Levels 15-17)
- **Present Perfect** (Levels 18-24)
- **Past Perfect** (Levels 25-29)
- **Modals & Special** (Levels 30-35)
- **Commands** (Levels 36-38)
- **Advanced** (Levels 39-47)

---

## Level-by-Level Test Cases

### **PRESENT TENSE (Levels 1-7)**

#### **Level 1: Basic Present Tense**
**Grammar Focus:** Subject + Verb (Basic)
**Patterns to Test:**
- ✅ I eat
- ✅ You work
- ✅ He/She/It runs
- ✅ We play
- ✅ They sing

**Incorrect Tests:**
- ❌ I eats (wrong verb form)
- ❌ He run (missing -s)
- ❌ They works (wrong verb form)

#### **Level 2: Present Simple Questions**
**Grammar Focus:** Do/Does + Subject + Verb
**Patterns to Test:**
- ✅ Do you eat?
- ✅ Does he work?
- ✅ Do they play?
- ✅ Does she sing?
- ✅ Do we need help?

#### **Level 3: Present Simple Negatives**
**Grammar Focus:** Don't/Doesn't + Verb
**Patterns to Test:**
- ✅ I don't eat
- ✅ He doesn't work
- ✅ They don't play
- ✅ She doesn't sing
- ✅ We don't need help

#### **Level 4: Present Continuous**
**Grammar Focus:** Am/Is/Are + Verb-ing
**Patterns to Test:**
- ✅ I am eating
- ✅ He is working
- ✅ They are playing
- ✅ She is singing
- ✅ We are helping

#### **Level 5: Present Continuous Questions**
**Grammar Focus:** Am/Is/Are + Subject + Verb-ing?
**Patterns to Test:**
- ✅ Are you eating?
- ✅ Is he working?
- ✅ Are they playing?
- ✅ Is she singing?
- ✅ Are we helping?

#### **Level 6: Present Continuous Negatives**
**Grammar Focus:** Am/Is/Are + Not + Verb-ing
**Patterns to Test:**
- ✅ I am not eating
- ✅ He is not working
- ✅ They are not playing
- ✅ She is not singing
- ✅ We are not helping

#### **Level 7: Mixed Present Forms**
**Grammar Focus:** All Present Tense Forms
**Patterns to Test:**
- ✅ I eat pizza (Simple)
- ✅ She is eating now (Continuous)
- ✅ Do you like music? (Question)
- ✅ He doesn't work here (Negative)
- ✅ Are they coming? (Continuous Question)

---

### **PAST TENSE (Levels 8-14)**

#### **Level 8: Past Simple Regular Verbs**
**Grammar Focus:** Verb + -ed
**Patterns to Test:**
- ✅ I worked yesterday
- ✅ She played tennis
- ✅ They walked home
- ✅ He helped me
- ✅ We studied English

#### **Level 9: Past Simple Irregular Verbs**
**Grammar Focus:** Irregular Verb Forms
**Patterns to Test:**
- ✅ I went home
- ✅ She ate dinner
- ✅ They saw the movie
- ✅ He took the bus
- ✅ We came early

#### **Level 10: Past Simple Questions**
**Grammar Focus:** Did + Subject + Verb?
**Patterns to Test:**
- ✅ Did you eat?
- ✅ Did she work?
- ✅ Did they play?
- ✅ Did he go?
- ✅ Did we win?

#### **Level 11: Past Simple Negatives**
**Grammar Focus:** Didn't + Verb
**Patterns to Test:**
- ✅ I didn't eat
- ✅ She didn't work
- ✅ They didn't play
- ✅ He didn't go
- ✅ We didn't win

#### **Level 12: Past Continuous**
**Grammar Focus:** Was/Were + Verb-ing
**Patterns to Test:**
- ✅ I was eating
- ✅ She was working
- ✅ They were playing
- ✅ He was going
- ✅ We were helping

#### **Level 13: Past Continuous Questions**
**Grammar Focus:** Was/Were + Subject + Verb-ing?
**Patterns to Test:**
- ✅ Were you eating?
- ✅ Was she working?
- ✅ Were they playing?
- ✅ Was he going?
- ✅ Were we helping?

#### **Level 14: Past Continuous Negatives**
**Grammar Focus:** Wasn't/Weren't + Verb-ing
**Patterns to Test:**
- ✅ I wasn't eating
- ✅ She wasn't working
- ✅ They weren't playing
- ✅ He wasn't going
- ✅ We weren't helping

---

### **FUTURE TENSES (Levels 15-17)**

#### **Level 15: Will Future**
**Grammar Focus:** Will + Verb
**Patterns to Test:**
- ✅ I will eat
- ✅ She will work
- ✅ They will play
- ✅ He will go
- ✅ We will help

#### **Level 16: Going to Future**
**Grammar Focus:** Am/Is/Are + Going to + Verb
**Patterns to Test:**
- ✅ I am going to eat
- ✅ She is going to work
- ✅ They are going to play
- ✅ He is going to go
- ✅ We are going to help

#### **Level 17: Present Continuous for Future**
**Grammar Focus:** Am/Is/Are + Verb-ing (Future Meaning)
**Patterns to Test:**
- ✅ I am eating later
- ✅ She is working tomorrow
- ✅ They are playing next week
- ✅ He is going tonight
- ✅ We are helping soon

---

### **PRESENT PERFECT (Levels 18-24)**

#### **Level 18: Present Perfect - Have/Has + Past Participle**
**Grammar Focus:** Have/Has + Past Participle
**Patterns to Test:**
- ✅ I have eaten
- ✅ She has worked
- ✅ They have played
- ✅ He has gone
- ✅ We have helped

#### **Level 19: Present Perfect with Ever/Never**
**Grammar Focus:** Have you ever...? / I have never...
**Patterns to Test:**
- ✅ Have you ever eaten sushi?
- ✅ I have never worked there
- ✅ Has she ever played tennis?
- ✅ They have never gone abroad
- ✅ We have ever helped before

#### **Level 20: Present Perfect with Already/Yet**
**Grammar Focus:** Already (Positive) / Yet (Negative/Question)
**Patterns to Test:**
- ✅ I have already eaten
- ✅ Have you eaten yet?
- ✅ She has already worked
- ✅ They haven't played yet
- ✅ We have already helped

#### **Level 21: Present Perfect with For/Since**
**Grammar Focus:** For (Period) / Since (Point in Time)
**Patterns to Test:**
- ✅ I have lived here for 5 years
- ✅ She has worked since 2020
- ✅ They have played since morning
- ✅ He has studied for 2 hours
- ✅ We have helped since yesterday

#### **Level 22: Present Perfect Questions**
**Grammar Focus:** Have/Has + Subject + Past Participle?
**Patterns to Test:**
- ✅ Have you eaten?
- ✅ Has she worked?
- ✅ Have they played?
- ✅ Has he gone?
- ✅ Have we helped?

#### **Level 23: Present Perfect Negatives**
**Grammar Focus:** Haven't/Hasn't + Past Participle
**Patterns to Test:**
- ✅ I haven't eaten
- ✅ She hasn't worked
- ✅ They haven't played
- ✅ He hasn't gone
- ✅ We haven't helped

#### **Level 24: Present Perfect vs Past Simple**
**Grammar Focus:** Present Perfect (Experience/Unspecified Time) vs Past Simple (Specific Time)
**Patterns to Test:**
- ✅ I have visited Paris (Experience)
- ✅ I visited Paris last year (Specific Time)
- ✅ She has eaten sushi before (Experience)
- ✅ She ate sushi yesterday (Specific Time)
- ✅ They have seen that movie (Experience)

---

### **PAST PERFECT (Levels 25-29)**

#### **Level 25: Past Perfect - Had + Past Participle**
**Grammar Focus:** Had + Past Participle (Action Before Another Past Action)
**Patterns to Test:**
- ✅ I had eaten before the movie
- ✅ She had finished work
- ✅ They had already left
- ✅ He had seen the doctor
- ✅ We had completed the project

#### **Level 26: Past Perfect with By/Since/Before**
**Grammar Focus:** Past Perfect in Time Clauses
**Patterns to Test:**
- ✅ I had finished by 5 PM
- ✅ She had left before I arrived
- ✅ They had eaten since morning
- ✅ He had worked before joining
- ✅ We had studied before the test

#### **Level 27: Past Perfect Questions**
**Grammar Focus:** Had + Subject + Past Participle?
**Patterns to Test:**
- ✅ Had you eaten?
- ✅ Had she finished?
- ✅ Had they left?
- ✅ Had he seen?
- ✅ Had we completed?

#### **Level 28: Past Perfect Negatives**
**Grammar Focus:** Hadn't + Past Participle
**Patterns to Test:**
- ✅ I hadn't eaten
- ✅ She hadn't finished
- ✅ They hadn't left
- ✅ He hadn't seen
- ✅ We hadn't completed

#### **Level 29: Past Perfect vs Past Simple**
**Grammar Focus:** Past Perfect (Earlier Action) vs Past Simple (Later Action)
**Patterns to Test:**
- ✅ I had finished when she arrived (Had finished first)
- ✅ She arrived after I had finished
- ✅ They had left before we got there
- ✅ We got there after they had left
- ✅ He had eaten before the party started

---

### **MODALS & SPECIAL (Levels 30-35)**

#### **Level 30: Can/Could**
**Grammar Focus:** Can (Ability/Permission) / Could (Past Ability)
**Patterns to Test:**
- ✅ I can swim
- ✅ She could play piano
- ✅ Can you help me?
- ✅ Could they come?
- ✅ He can speak French

#### **Level 31: May/Might**
**Grammar Focus:** May/Might (Possibility)
**Patterns to Test:**
- ✅ I may go home
- ✅ She might be late
- ✅ May I help you?
- ✅ They might come
- ✅ He may need help

#### **Level 32: Should/Ought to**
**Grammar Focus:** Should/Ought to (Advice/Obligation)
**Patterns to Test:**
- ✅ I should study
- ✅ She ought to rest
- ✅ Should we go?
- ✅ They should help
- ✅ He ought to apologize

#### **Level 33: Must/Have to**
**Grammar Focus:** Must (Strong Obligation) / Have to (Necessity)
**Patterns to Test:**
- ✅ I must go now
- ✅ She has to work
- ✅ Must you leave?
- ✅ They have to study
- ✅ He must be careful

#### **Level 34: Will/Would**
**Grammar Focus:** Will (Future/Promise) / Would (Conditional/Polite Request)
**Patterns to Test:**
- ✅ I will help you
- ✅ She would like tea
- ✅ Will you come?
- ✅ They would prefer coffee
- ✅ He will be there

#### **Level 35: Mixed Modals**
**Grammar Focus:** All Modal Verbs Together
**Patterns to Test:**
- ✅ I can and will help
- ✅ She might but shouldn't go
- ✅ Could you please help?
- ✅ They must and should study
- ✅ He may or may not come

---

### **COMMANDS (Levels 36-38)**

#### **Level 36: Imperatives**
**Grammar Focus:** Verb (Base Form) - Commands
**Patterns to Test:**
- ✅ Eat your dinner
- ✅ Close the door
- ✅ Help me please
- ✅ Be careful
- ✅ Come here

#### **Level 37: Negative Imperatives**
**Grammar Focus:** Don't + Verb - Negative Commands
**Patterns to Test:**
- ✅ Don't eat that
- ✅ Don't close the door
- ✅ Don't be late
- ✅ Don't forget
- ✅ Don't worry

#### **Level 38: Polite Requests**
**Grammar Focus:** Could you...? / Would you...? / Please...
**Patterns to Test:**
- ✅ Could you help me?
- ✅ Would you please close the door?
- ✅ Please be quiet
- ✅ Could you pass the salt?
- ✅ Would you mind helping?

---

### **ADVANCED (Levels 39-47)**

#### **Level 39: Passive Voice Present**
**Grammar Focus:** Am/Is/Are + Past Participle
**Patterns to Test:**
- ✅ The door is closed
- ✅ The food is eaten
- ✅ The work is done
- ✅ The house is built
- ✅ The letter is written

#### **Level 40: Passive Voice Past**
**Grammar Focus:** Was/Were + Past Participle
**Patterns to Test:**
- ✅ The door was closed
- ✅ The food was eaten
- ✅ The work was done
- ✅ The house was built
- ✅ The letter was written

#### **Level 41: Reported Speech**
**Grammar Focus:** Said/Told + That + Tense Change
**Patterns to Test:**
- ✅ He said he was tired
- ✅ She told me she liked it
- ✅ They said they would come
- ✅ He said he had eaten
- ✅ She told us she could help

#### **Level 42: Conditionals (If Clauses)**
**Grammar Focus:** If + Present, Will + Verb (Type 1)
**Patterns to Test:**
- ✅ If it rains, I will stay home
- ✅ If she studies, she will pass
- ✅ If they come, we will eat
- ✅ If he works hard, he will succeed
- ✅ If we help, they will finish

#### **Level 43: Conditional Questions**
**Grammar Focus:** What would you do if...?
**Patterns to Test:**
- ✅ What would you do if you won?
- ✅ What would she say if she knew?
- ✅ What would they eat if they could?
- ✅ What would he buy if he had money?
- ✅ What would we do if it rained?

#### **Level 44: Relative Clauses**
**Grammar Focus:** Who/Which/That Clauses
**Patterns to Test:**
- ✅ The man who lives here is nice
- ✅ The book which I read was good
- ✅ The car that broke down was old
- ✅ People who work hard succeed
- ✅ Food which is healthy is good

#### **Level 45: Complex Sentences**
**Grammar Focus:** Multiple Clauses and Structures
**Patterns to Test:**
- ✅ Although it rained, we went out
- ✅ Because she was tired, she rested
- ✅ When I finish, I will call you
- ✅ After they ate, they left
- ✅ While we waited, we talked

#### **Level 46: Advanced Question Forms**
**Grammar Focus:** Complex Question Structures
**Patterns to Test:**
- ✅ What do you think about this?
- ✅ How long have you been here?
- ✅ Whose book is this?
- ✅ How many people came?
- ✅ What kind of music do you like?

#### **Level 47: Advanced Mixed Grammar**
**Grammar Focus:** All Grammar Combined
**Patterns to Test:**
- ✅ I have been working since I arrived, but I haven't finished yet
- ✅ She said she would help if we asked, but we haven't called her
- ✅ Although it was raining, they decided to go out anyway
- ✅ The man who lives next door, whom I met yesterday, is very friendly
- ✅ If I had known you were coming, I would have prepared dinner

---

## Testing Checklist

### **For Each Level:**
- [ ] Test 5+ correct sentence combinations
- [ ] Test 5+ incorrect sentence combinations
- [ ] Verify grammar rules are enforced
- [ ] Test word order requirements
- [ ] Test subject-verb agreement
- [ ] Test tense consistency
- [ ] Test UI feedback (correct/incorrect)
- [ ] Test level completion
- [ ] Test progress saving (if applicable)

### **Cross-Level Testing:**
- [ ] Test level progression
- [ ] Test category completion
- [ ] Test grammar knowledge retention
- [ ] Test challenging sentence combinations
- [ ] Test edge cases and complex scenarios

### **Bug Testing:**
- [ ] Test with missing words
- [ ] Test with wrong word order
- [ ] Test with incorrect verb forms
- [ ] Test with wrong tense usage
- [ ] Test with incorrect question forms

---

## Expected Behavior

### **Correct Sentences Should:**
- ✅ Be accepted by the system
- ✅ Show green/positive feedback
- ✅ Allow progression to next sentence
- ✅ Count toward level completion

### **Incorrect Sentences Should:**
- ❌ Be rejected by the system
- ❌ Show red/negative feedback
- ❌ Provide helpful correction hints
- ❌ Not count toward level completion

### **System Should:**
- ✅ Enforce proper grammar rules
- ✅ Maintain consistent feedback
- ✅ Handle edge cases gracefully
- ✅ Provide clear progression indicators
- ✅ Save user progress (if applicable)

---

## Notes

- Test each level systematically
- Document any bugs or unexpected behavior
- Verify grammar rules match the level descriptions
- Test both categorized and shuffled word modes
- Ensure the grammar engine correctly validates all patterns

This testing guide covers all 47 levels and ensures comprehensive testing of the grammar validation system.
