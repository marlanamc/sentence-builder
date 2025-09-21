'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VerbSystemGuideProps {
  open: boolean
  onClose: () => void
}

export function VerbSystemGuide({ open, onClose }: VerbSystemGuideProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Verb System Guide</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3 text-blue-600">Verb Forms Overview</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">V1 - Base Form</h4>
                  <p className="text-sm text-gray-600">Used with I, you, we, they</p>
                  <p className="text-sm mt-1 font-mono">eat, go, play, work</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">V1-3rd - Third Person</h4>
                  <p className="text-sm text-gray-600">Used with he, she, it</p>
                  <p className="text-sm mt-1 font-mono">eats, goes, plays, works</p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">V1-ing - Present Participle</h4>
                  <p className="text-sm text-gray-600">Used with am/is/are, was/were</p>
                  <p className="text-sm mt-1 font-mono">eating, going, playing, working</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">V2 - Past Form</h4>
                  <p className="text-sm text-gray-600">Used for past simple</p>
                  <p className="text-sm mt-1 font-mono">ate, went, played, worked</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">V3 - Past Participle</h4>
                  <p className="text-sm text-gray-600">Used with have/has, been</p>
                  <p className="text-sm mt-1 font-mono">eaten, gone, played, worked</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-green-600">Present Tense Rules</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2 text-sm">
                  <li><strong>I/You/We/They:</strong> Use V1 (base form) → "I eat pizza"</li>
                  <li><strong>He/She/It:</strong> Use V1-3rd (add -s) → "She eats pizza"</li>
                  <li><strong>Questions:</strong> Do/Does + subject + V1 → "Do you eat pizza?"</li>
                  <li><strong>Negatives:</strong> Don't/Doesn't + V1 → "I don't eat meat"</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-orange-600">Past Tense Rules</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2 text-sm">
                  <li><strong>All subjects:</strong> Use V2 → "I ate pizza yesterday"</li>
                  <li><strong>Questions:</strong> Did + subject + V1 → "Did you eat pizza?"</li>
                  <li><strong>Negatives:</strong> Didn't + V1 → "I didn't eat meat"</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-red-600">Present Perfect Rules</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2 text-sm">
                  <li><strong>I/You/We/They:</strong> Have + V3 → "I have eaten pizza"</li>
                  <li><strong>He/She/It:</strong> Has + V3 → "She has eaten pizza"</li>
                  <li><strong>Questions:</strong> Have/Has + subject + V3 → "Have you eaten pizza?"</li>
                  <li><strong>Negatives:</strong> Haven't/Hasn't + V3 → "I haven't eaten"</li>
                  <li><strong>Time Markers:</strong> already, just, yet, ever, never, since, for</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-blue-600">Present Continuous Rules</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2 text-sm">
                  <li><strong>I:</strong> Am + V1-ing → "I am eating pizza"</li>
                  <li><strong>You/We/They:</strong> Are + V1-ing → "You are eating pizza"</li>
                  <li><strong>He/She/It:</strong> Is + V1-ing → "She is eating pizza"</li>
                  <li><strong>Questions:</strong> Am/Is/Are + subject + V1-ing → "Are you eating?"</li>
                  <li><strong>Negatives:</strong> Am/Is/Are + not + V1-ing → "I am not eating"</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-purple-600">Future Tense Rules</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2 text-sm">
                  <li><strong>Will Future:</strong> Will + V1 → "I will eat pizza tomorrow"</li>
                  <li><strong>Going to:</strong> Am/Is/Are + going to + V1 → "I am going to eat"</li>
                  <li><strong>Present Continuous for Future:</strong> Am/Is/Are + V1-ing → "I am eating later"</li>
                  <li><strong>Questions:</strong> Will you...? / Are you going to...?</li>
                  <li><strong>Negatives:</strong> Won't + V1 / Am not going to + V1</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-indigo-600">Modal Verbs</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Ability:</strong>
                    <ul className="ml-4 mt-1">
                      <li>Can + V1 → "I can swim"</li>
                      <li>Could + V1 → "I could swim when I was young"</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Permission:</strong>
                    <ul className="ml-4 mt-1">
                      <li>May + V1 → "May I leave?"</li>
                      <li>Can + V1 → "Can I help you?"</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Obligation:</strong>
                    <ul className="ml-4 mt-1">
                      <li>Must + V1 → "You must study"</li>
                      <li>Have to + V1 → "I have to work"</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Advice:</strong>
                    <ul className="ml-4 mt-1">
                      <li>Should + V1 → "You should rest"</li>
                      <li>Ought to + V1 → "You ought to apologize"</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Possibility:</strong>
                    <ul className="ml-4 mt-1">
                      <li>Might + V1 → "It might rain"</li>
                      <li>Could + V1 → "It could be true"</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Requests:</strong>
                    <ul className="ml-4 mt-1">
                      <li>Would + V1 → "Would you help me?"</li>
                      <li>Could + V1 → "Could you pass the salt?"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-green-600">Commands & Suggestions</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2 text-sm">
                  <li><strong>Imperatives:</strong> V1 → "Eat your dinner!" / "Close the door!"</li>
                  <li><strong>Negative Commands:</strong> Don't + V1 → "Don't eat that!" / "Don't be late!"</li>
                  <li><strong>Polite Requests:</strong> Please + V1 → "Please help me."</li>
                  <li><strong>Suggestions:</strong> Let's + V1 → "Let's go home."</li>
                  <li><strong>Polite Questions:</strong> Could you + V1? → "Could you help me?"</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-yellow-600">Time Expressions</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>AT:</strong>
                    <ul className="ml-4 mt-1">
                      <li>at 9 AM</li>
                      <li>at noon</li>
                      <li>at night</li>
                      <li>at breakfast</li>
                    </ul>
                  </div>
                  <div>
                    <strong>IN:</strong>
                    <ul className="ml-4 mt-1">
                      <li>in January</li>
                      <li>in 2023</li>
                      <li>in the morning</li>
                      <li>in summer</li>
                    </ul>
                  </div>
                  <div>
                    <strong>ON:</strong>
                    <ul className="ml-4 mt-1">
                      <li>on Monday</li>
                      <li>on Christmas</li>
                      <li>on my birthday</li>
                      <li>on the weekend</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4">
                  <strong>Frequency:</strong> always (100%) → usually → often → sometimes → rarely → never (0%)
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-pink-600">Comparisons</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Comparatives (comparing 2 things):</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li><strong>Short adjectives:</strong> -er + than</li>
                      <li>• tall → taller than → "She is taller than me"</li>
                      <li>• big → bigger than → "My car is bigger than yours"</li>
                      <li>• easy → easier than → "Math is easier than science"</li>
                      <li><strong>Long adjectives:</strong> more + adjective + than</li>
                      <li>• beautiful → more beautiful than</li>
                      <li>• expensive → more expensive than</li>
                      <li>• interesting → more interesting than</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Superlatives (comparing 3+ things):</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li><strong>Short adjectives:</strong> the + -est</li>
                      <li>• tall → the tallest → "She is the tallest student"</li>
                      <li>• big → the biggest → "This is the biggest room"</li>
                      <li>• easy → the easiest → "This is the easiest test"</li>
                      <li><strong>Long adjectives:</strong> the most + adjective</li>
                      <li>• beautiful → the most beautiful</li>
                      <li>• expensive → the most expensive</li>
                      <li>• interesting → the most interesting</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 border-t pt-4">
                  <strong>Irregular Comparisons:</strong>
                  <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                    <div>good → better → the best</div>
                    <div>bad → worse → the worst</div>
                    <div>far → farther → the farthest</div>
                  </div>
                </div>
                <div className="mt-4 border-t pt-4">
                  <strong>Indefinite Pronouns:</strong>
                  <div className="mt-2 text-sm">
                    <p><strong>Someone/Everyone/Anyone/No one</strong> (people) + singular verb</p>
                    <p><strong>Something/Everything/Anything/Nothing</strong> (things) + singular verb</p>
                    <p>Examples: "Someone <em>is</em> calling" / "Everything <em>looks</em> good" / "Nothing <em>works</em>"</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-red-600">Advanced Grammar</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">

                <div>
                  <strong className="text-blue-600">Relative Clauses:</strong>
                  <ul className="ml-4 mt-1 space-y-1 text-sm">
                    <li><strong>WHO</strong> (for people): "The man <em>who lives here</em> is my teacher"</li>
                    <li><strong>WHICH</strong> (for things): "The book <em>which I read</em> was interesting"</li>
                    <li><strong>THAT</strong> (for people or things): "The car <em>that I bought</em> is red"</li>
                    <li><strong>WHERE</strong> (for places): "The school <em>where I study</em> is nearby"</li>
                    <li><strong>WHEN</strong> (for time): "The day <em>when we met</em> was special"</li>
                  </ul>
                </div>

                <div>
                  <strong className="text-green-600">Conditional Sentences:</strong>
                  <ul className="ml-4 mt-1 space-y-1 text-sm">
                    <li><strong>First Conditional (Real Future):</strong> If + present, will + V1</li>
                    <li>→ "If it rains, I will stay home"</li>
                    <li><strong>Second Conditional (Unreal Present):</strong> If + past, would + V1</li>
                    <li>→ "If I had money, I would travel"</li>
                    <li><strong>Third Conditional (Unreal Past):</strong> If + past perfect, would have + V3</li>
                    <li>→ "If I had studied, I would have passed"</li>
                  </ul>
                </div>

                <div>
                  <strong className="text-purple-600">Tag Questions:</strong>
                  <ul className="ml-4 mt-1 space-y-1 text-sm">
                    <li><strong>Positive statement → negative tag:</strong> "You like pizza, <em>don't you?</em>"</li>
                    <li><strong>Negative statement → positive tag:</strong> "You don't like pizza, <em>do you?</em>"</li>
                    <li><strong>With BE:</strong> "She is happy, <em>isn't she?</em>" / "He isn't here, <em>is he?</em>"</li>
                    <li><strong>With WILL:</strong> "It will rain, <em>won't it?</em>" / "She won't come, <em>will she?</em>"</li>
                  </ul>
                </div>

                <div>
                  <strong className="text-orange-600">Reported Speech:</strong>
                  <ul className="ml-4 mt-1 space-y-1 text-sm">
                    <li><strong>Tense Changes:</strong> Present → Past, Past → Past Perfect, Will → Would</li>
                    <li>Direct: "I am tired" → Reported: "He said he <em>was</em> tired"</li>
                    <li>Direct: "I worked yesterday" → Reported: "She said she <em>had worked</em>"</li>
                    <li>Direct: "I will come" → Reported: "He said he <em>would come</em>"</li>
                    <li><strong>Time changes:</strong> today → that day, tomorrow → the next day, yesterday → the day before</li>
                  </ul>
                </div>

                <div>
                  <strong className="text-indigo-600">Embedded Questions:</strong>
                  <ul className="ml-4 mt-1 space-y-1 text-sm">
                    <li><strong>Use statement word order</strong> (not question order)</li>
                    <li>Direct: "What time is it?" → Embedded: "Do you know <em>what time it is</em>?"</li>
                    <li>Direct: "Where do you live?" → Embedded: "Can you tell me <em>where you live</em>?"</li>
                    <li>Direct: "When will she arrive?" → Embedded: "I wonder <em>when she will arrive</em>"</li>
                  </ul>
                </div>

                <div>
                  <strong className="text-teal-600">Phrasal Verbs (Common Examples):</strong>
                  <ul className="ml-4 mt-1 space-y-1 text-sm">
                    <li><strong>Separable:</strong> "Turn <em>on</em> the light" = "Turn the light <em>on</em>"</li>
                    <li><strong>Inseparable:</strong> "Look <em>after</em> the children" (cannot separate)</li>
                    <li>• get up (wake up), turn off (stop), put on (wear), take off (remove)</li>
                    <li>• look for (search), look after (care for), run into (meet by chance)</li>
                  </ul>
                </div>

              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-indigo-600">Common Irregular Verbs</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-5 gap-4 text-sm">
                  <div className="font-medium">V1</div>
                  <div className="font-medium">V1-3rd</div>
                  <div className="font-medium">V1-ing</div>
                  <div className="font-medium">V2</div>
                  <div className="font-medium">V3</div>

                  <div>go</div><div>goes</div><div>going</div><div>went</div><div>gone</div>
                  <div>eat</div><div>eats</div><div>eating</div><div>ate</div><div>eaten</div>
                  <div>see</div><div>sees</div><div>seeing</div><div>saw</div><div>seen</div>
                  <div>do</div><div>does</div><div>doing</div><div>did</div><div>done</div>
                  <div>have</div><div>has</div><div>having</div><div>had</div><div>had</div>
                  <div>be</div><div>is</div><div>being</div><div>was/were</div><div>been</div>
                  <div>get</div><div>gets</div><div>getting</div><div>got</div><div>gotten</div>
                  <div>run</div><div>runs</div><div>running</div><div>ran</div><div>run</div>
                  <div>come</div><div>comes</div><div>coming</div><div>came</div><div>come</div>
                  <div>take</div><div>takes</div><div>taking</div><div>took</div><div>taken</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}