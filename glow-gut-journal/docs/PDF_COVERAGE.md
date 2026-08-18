# Source PDF coverage contract

The V1 app must capture or faithfully derive every information field used by the 12-page Glow Up Gut Journal.

| Source item | App representation | Status |
|---|---|---|
| Date | entry/day date | ✅ |
| Day type: home/camp/outing/travel | Day details | ✅ |
| Wake time | Day details | ✅ |
| Bed time | Day details | ✅ |
| Breakfast/lunch/snack/dinner/other | Meal type | ✅ |
| Short freehand food/drink note | Meal description | ✅ |
| Same as yesterday / repeat | Repeat-last / copy-yesterday interaction | ✅ |
| Meal/drink photo | Optional camera/file input | ✅ |
| Fruit | Meal tag | ✅ |
| Vegetables | Meal tag | ✅ |
| Oats | Meal tag | ✅ |
| Beans | Meal tag | ✅ |
| Dairy | Meal tag | ✅ |
| Rice/noodles | Meal tag | ✅ |
| Fried/fast food | Meal tag | ✅ |
| Prunes amount | Meal fiber food amount | ✅ |
| Kiwi amount | Meal fiber food amount | ✅ |
| Pear amount | Meal fiber food amount | ✅ |
| Unsure meal | Meal tag/freehand text | ✅ |
| Few sips | Drink estimate | ✅ |
| 1/2 cup ≈ 4 oz | Drink estimate | ✅ |
| 1 cup ≈ 8 oz | Drink estimate | ✅ |
| 2 cups ≈ 16 oz | Drink estimate | ✅ |
| 1/2 small bottle ≈ 8 oz | Drink estimate | ✅ |
| Full small bottle ≈ 16 oz | Drink estimate | ✅ |
| Full large bottle ≈ 32 oz | Drink estimate | ✅ |
| Soup counts as liquid | Drink type + normalized amount | ✅ |
| Poop time | Poop event | ✅ |
| Bristol Type 1 | Bristol selector | ✅ |
| Bristol Type 2 | Bristol selector | ✅ |
| Bristol Type 3 | Bristol selector | ✅ |
| Bristol Type 4 | Bristol selector | ✅ |
| Bristol Type 5 | Bristol selector | ✅ |
| Bristol Type 6 | Bristol selector | ✅ |
| Bristol Type 7 | Bristol selector | ✅ |
| Real-shape Bristol reference | SVG Bristol guide | ✅ |
| Stool amount tiny/small/med/large | Poop details | ✅ |
| Poop pain 0–10 | Poop details | ✅ |
| Blood no/yes | Poop details | ✅ |
| Morning/afternoon/bedtime bloat | Symptom event timing | ✅ |
| Bloating 0–10 | Symptom event | ✅ |
| Belly/pelvic pain 0–10 | Symptom event | ✅ |
| Gas none/mild/bad | Symptom event (none/mild/a lot) | ✅ |
| Hard/swollen no/yes | Symptom event | ✅ |
| Period started today | Daily check-in | ✅ |
| Days late | Daily check-in | ✅ |
| Spotting | Daily check-in | ✅ |
| Cramps/pelvic pain 0–10 | Daily check-in | ✅ |
| Held poop/avoided public bathroom | Daily check-in | ✅ |
| Sat after meal 5–10 min | Daily check-in | ✅ |
| Feet supported | Daily check-in | ✅ |
| Activity/walk none/some/good | Daily check-in | ✅ |
| Stress low/med/high | Daily check-in | ✅ |
| Urine pale/yellow/dark | Daily check-in | ✅ |
| Appetite normal/low | Daily check-in | ✅ |
| Water low/OK/good | Evening wrap-up | ✅ |
| Fiber low/OK/good | Evening wrap-up | ✅ |
| Worst bloat 0–10 | Evening wrap-up | ✅ |
| Daily poop none/pebbly/hard/normal/loose | Evening wrap-up | ✅ |
| Prunes no/little/yes/more gas | Evening wrap-up | ✅ |
| Severe/worsening belly or pelvic pain | Safety note | ✅ |
| Vomiting | Safety note | ✅ |
| Blood in stool | Poop + safety note | ✅ |
| Black stool | Safety note | ✅ |
| Weight loss | Safety note | ✅ |
| Fever | Safety note | ✅ |
| Hard swollen belly | Symptom + safety note | ✅ |
| Cannot pass stool or gas | Safety note | ✅ |
| Fainting | Safety note | ✅ |
| Pain waking from sleep | Safety note | ✅ |
| Stool accidents/leaking | Poop optional details + safety note | ✅ |
| Positive pregnancy test with pain/bleeding | Safety note | ✅ |
| No period about 90 days | Safety note | ✅ |
| Weekly total poops | Calculated | ✅ |
| Weekly days with no poop | Calculated as no logged poop | ✅ |
| Days with Type 1 | Calculated | ✅ |
| Best stool type | Weekly user review | ✅ |
| Highest poop pain | Calculated | ✅ |
| Weekly blood yes/no | Calculated | ✅ |
| Highest belly pain | Calculated | ✅ |
| Average bloating | Calculated | ✅ |
| Worst bloating | Calculated | ✅ |
| Worse after meals? | Weekly user review | ✅ |
| Better after poop/gas? | Weekly user review | ✅ |
| Water usually low/OK/good | Weekly user review | ✅ |
| Away-from-home hydration | Weekly user review | ✅ |
| Dark urine days | Calculated | ✅ |
| Fiber-food days | Calculated from logged meal tags/fiber foods | ✅ |
| Dairy/cheese-heavy days | Calculated from explicit heavy meal tag | ✅ |
| White-carb-heavy days | Calculated from explicit heavy meal tag | ✅ |
| Prune days | Calculated | ✅ |
| Last period start | Calculated from check-ins | ✅ |
| Days late by end of week | Latest check-in | ✅ |
| Weekly cramps/pelvic pain | Calculated maximum | ✅ |
| Held poop frequency | Weekly user review + logged day count | ✅ |
| Sat after meal frequency | Weekly user review + logged day count | ✅ |
| Repeated meal pattern 1–3 | Calculated suggestions + user review | ✅ |
| Repeated meal count | Calculated / editable | ✅ |
| Pebbly stool on same days? | Weekly user review | ✅ |
| High bloating on same days? | Weekly user review | ✅ |
| Pediatrician question: chronic constipation/stool backup | Prefilled doctor questions | ✅ |
| Pediatrician question: safest treatment/dose | Prefilled doctor questions | ✅ |
| Pediatrician question: thyroid/anemia/celiac/glucose/hormones/PCOS labs | Prefilled doctor questions | ✅ |
| Pediatrician question: missed period evaluation | Prefilled doctor questions | ✅ |
| Pediatrician question: urgent-care symptoms | Prefilled doctor questions | ✅ |
