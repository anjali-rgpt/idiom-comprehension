library(tidyverse)
library(lme4)
library(languageR)
library(brms)

# set working directory to directory of script
setwd(dirname(rstudioapi::getSourceEditorContext()$path))

idioms = read.csv('../data/idiom_clean.csv')

summary(idioms)
names(idioms)

# Step 1: convert all the character columns to categories since we need to analyze result on the basis of other predictors, as well as per item and per participant

idioms[sapply(idioms, is.character)] <- lapply(idioms[sapply(idioms, is.character)], 
                                       as.factor)
idioms$workerid <- as.factor(idioms$workerid)


# Step 2: Distribution of responses

table(idioms$result) # here we see that num(correct) > num(incorrect) but this is factoring in English which acts as an attention check. We can eliminate about 394 options to get 618 correct idioms.
table(idioms$Affect) # distribution of affect in idioms is as expected because idioms, being figurative, tend to be used to express more negative concepts so as to not directly imply the negative meaning through literal use
prop.table(table(idioms$result))

idiomsnew <- idioms[, -c(1,4,6,8) ]
idiomsnewenglish <- idioms[, -c(1,4,6,8) ]

table(idiomsnew$result)

summary(idiomsnew)

prop.table(table(idiomsnew$result))  # proportion of correct vs incorrect without reflecting the English idioms

# we work with the idiomsnew table now

# Visualizing the proportion of correct responses for each language


barplot(prop.table(table(idiomsnew$result, idiomsnew$language), margin = 2),
        legend.text = T,
        beside = T,
        args.legend=list(x = "topleft",
          horiz = TRUE
        ),
        xlab = "Language",
        ylab = "Proportion",
        main = "Proportion of expected meaning predictions per language")

box()



  
dftmp = as.data.frame(prop.table(table(idiomsnew$idiom, idiomsnew$result), mar = c(1)))
dftmp %>%
ggplot() +
  labs(title = "Proportion of Expected('Correct') Meaning Predictions By Idiom Descending ",
       x = "Expected Meaning Proportion",
       y = "Idiom",
       fill = "Correct/Incorrect") + 
  scale_fill_brewer(palette = "Set2") +
  geom_bar(aes(x = reorder(Var1, Freq), y = Freq, 
               fill = Var2), stat = "identity", show.legend = TRUE) + coord_flip()

# Step 3: Identify reference level through contrasts

contrasts(idiomsnew$result)
contrasts(idiomsnew$language)
contrasts(idiomsnew$Affect)
prop.table(table(idiomsnew$result))

# Step 4A: Baseline simple logistic regression model with no predictors - just running a prediction for the data
m.norandom = glm(result ~ 1, data=idiomsnew, family="binomial")
summary(m.norandom)

#Logistic regression with the direct effect of language and no mixed effects of item and participant variability
m.norandomlang = glm(result ~ language, data = idiomsnew, family = 'binomial')
summary(m.norandomlang)

# The results of this part show that the log odds of Hindi idioms being predicted correctly is around 0.34  which is around 58%
# The log odds for getting a different idiom meaning than expected (moving from correct to incorrect) increase if the idiom language is Russian compared to Hindi. 
# Or, the likelihood of an expected prediction for Russian compared to Hindi is about 40% lower. 
# Hindi is the reference language.

m.norandomaffect = glm(result ~ Affect, data = idiomsnew, family = 'binomial')
summary(m.norandomaffect)

# Step 4B: We start checking for mixed effects
prop.table(table(idiomsnew$idiom, idiomsnew$result), mar = c(1)) # gives per-item proportions


# mixed effect model with items as random effects
m.item = glmer(result ~ 1 + (1|idiom), data=idiomsnew, family="binomial")
summary(m.item)

# mixed effect model with language as a fixed effect and item as random effect (useless because an idiom can only come from one language)
m.itemlang = glmer(result ~ language + (1|idiom), data=idiomsnew, family="binomial")
summary(m.itemlang)


# mixed effect model with participants as random effects and language as fixed effect
m.langpart = glmer(result ~ language + (1|workerid), data=idiomsnew, family="binomial")
summary(m.langpart)

# Step 4C: What happens if we center the language factor?
prop.table(table(idiomsnew[,c("language","result")]),mar=c(1))

idiomsnew = idiomsnew %>% 
  mutate(language_mandarin = fct_relevel(language, "Mandarin Chinese"))
m = glmer(result ~ language_mandarin + (1|workerid), data=idiomsnew, family="binomial")
summary(m)

idiomsnew = idiomsnew %>% 
  mutate(language_rus = fct_relevel(language, "Russian"))
m = glmer(result ~ language_rus + (1|workerid), data=idiomsnew, family="binomial")
summary(m)

m = glm(result ~ language_rus, data=idiomsnew, family="binomial")
summary(m)

# Note that the effects for Russian and Hindi are especially significant but this shows that overall, compared to Russian, the other languages have a higher likelihood of being right (especially Hindi)
# This is taking into account variability

idiomsnew = idiomsnew %>% 
  mutate(language_sp = fct_relevel(language, "Spanish"))
m = glmer(result ~ language_sp + (1|workerid), data=idiomsnew, family="binomial")
summary(m)

# What happens if we center the mean of languages?

idiomsnew = idiomsnew %>%
  mutate(numLang = as.numeric(language)) %>%
  mutate(cLang = numLang - mean(numLang))
summary(idiomsnew)

m.c = glmer(result ~ cLang + (1|workerid) + (1|idiom), data=idiomsnew, family="binomial")
summary(m.c)

# What if we add a random slope for language across workers?
m.c = glmer(result ~ language + (1 + language|workerid), data=idiomsnew, family="binomial")
summary(m.c)

m.c = glmer(result ~ 1 + language|workerid, data=idiomsnew, family="binomial")
summary(m.c)
# for each worker, the variance in their prediction of the expected meaning is fairly low for each language - the variance is the highest in Spanish and the lowest in Hindi. 

m.c = glmer(result ~ language + (1 + language|workerid), data=idiomsnew, family="binomial")
summary(m.c)

m.c = glmer(result ~ language +  (1 + language||workerid), data=idiomsnew, family="binomial")
summary(m.c)



m.complete = glmer(result ~ language + (language | workerid), data = idiomsnew, family = "binomial", control=glmerControl(optimizer="nloptwrap",
                                                                                                                                                 optCtrl=list(maxfun=100000)))
summary(m.complete)

