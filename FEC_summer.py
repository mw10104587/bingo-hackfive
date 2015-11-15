import csv, json
from datetime import datetime
import time

transactionDict = {}

with open("FEC_data.csv", "rU") as f:

	# a list trying to get all the names of party in file
	partyList = []

	dataFile = csv.DictReader(f)
	for donate in dataFile:
		
		trans_date = donate["TRANSACTION_DT"]
		amount = int(donate["TRANSACTION_AMT"])
		party = donate["CMTE_PTY_AFFILIATION"]

		# make all space into unknown
		if party == "" or party == ".":
			party = "UNK"

		if party not in partyList:
			partyList.append(party)

		if trans_date == "NA":
			continue

		# parse the year string no matter the length
		year = int(trans_date[-4:])

		# the data is dirty, sometimes it's length = 7, sometimes = 8.
		# we use different ways to get substring
		if len(trans_date) == 8:
			month = int(trans_date[0:2])
			day = int(trans_date[2:4])	
		
		if len(trans_date) == 7:
			month = int(trans_date[0])
			day = int(trans_date[1:3])	


		# print year
		# print month
		# print day

		# transaction time in datetime format
		trans_datetime = datetime(year, month, day)

		# get the time stamp of the date, but not used.

		# trans_timestamp = time.mktime(trans_datetime.timetuple())
		# timestampStr = str(int(trans_timestamp) )
		
		# the name of the var is called timestampStr, but it's in fact, in this format
		# 2015-6-01
		timestampStr = str(year) + "-" + str(month) + '-' + str(day)

		# init dictionary for saving the amount
		# inside the dictionary, keys are party names
		if timestampStr not in transactionDict:
			transactionDict[timestampStr] = {
				party: amount
			}
		else:
			if party in transactionDict[timestampStr]:
				transactionDict[timestampStr][party] += amount
			else:
				transactionDict[timestampStr][party] = amount


	print json.dumps(transactionDict, indent=4)

	# turn the dictionary into list, so that we can sort it.
	outputList = [{"value": v, "key": k} for k, v in transactionDict.iteritems()]

	# we make a datetime object so that we can sort according to it.
	for obj in outputList:
		dateList = obj["key"].split("-")
		obj["date"] = datetime(int(dateList[0]), int(dateList[1]), int(dateList[2]))

	# sort it here.
	outputList.sort(key=lambda item:item['date'], reverse=True)
	# print outputList

	# filter data that is before 2015
	outputList = [{ 'key': obj["key"], "value": obj["value"]} for obj in outputList if obj["date"] > datetime(2014,12,31)]
	print outputList
	# outputList = sorted(outputList, key = lambda x: x[""])
	print json.dumps(partyList, indent=4)
	

	# with open("FEC_sum_by_party.json", "w") as of:
		# json.dump(outputList, of)
		