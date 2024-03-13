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

prop.table(table(idioms$result))

idiomsnew <- idioms[-which(idioms$language %in% "English"), ]

table(idiomsnew$result)

prop.table(table(idiomsnew$result)).  # proportion of correct vs incorrect without reflecting the English idioms

# we work with the idiomsnew table now
# Step 3
