import numpy as np
import data_helper
from sklearn.metrics import cohen_kappa_score
import pandas as pd

if __name__ == "__main__":
    ignore_files = []
    to_exclude = []
    target_classes = []


    #test 1
    data_folder = "manual_sessions/cpr_test_1"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the annotations is: " + str(np.shape(annotations)) + "\n")
    rater1 = annotations.copy()


    #animation 1x
    data_folder = "manual_sessions/cpr_test_animation_1"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the annotations is: " + str(np.shape(annotations)) + "\n")
    rater2 = annotations.copy()

    #test 2
    data_folder = "manual_sessions/cpr_test_2"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the annotations is: " + str(np.shape(annotations)) + "\n")
    rater3 = annotations.copy()

    #animation 2
    data_folder = "manual_sessions/cpr_test_animation_2"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the annotations is: " + str(np.shape(annotations)) + "\n")
    rater4 = annotations.copy()


    a  = round(cohen_kappa_score(rater2['bodyWeight'], rater1['bodyWeight'], labels=None, weights=None),3)
    b = round(cohen_kappa_score(rater3['bodyWeight'], rater1['bodyWeight'], labels=None, weights=None), 3)
    c = round(cohen_kappa_score(rater3['bodyWeight'], rater2['bodyWeight'], labels=None, weights=None),3)
    d = round(cohen_kappa_score(rater4['bodyWeight'], rater1['bodyWeight'], labels=None, weights=None),3)
    e = round(cohen_kappa_score(rater4['bodyWeight'], rater2['bodyWeight'], labels=None, weights=None),3)
    f = round(cohen_kappa_score(rater4['bodyWeight'], rater3['bodyWeight'], labels=None, weights=None),3)

    data = {'r':['r1', 'r2', 'r3', 'r4'], 'r1':['1', a, b, d], 'r2':[a, '1', c, e], 'r3':[b, c, '1', f],'r4':[d, e, f, '1']}
    bodyWeight = pd.DataFrame(data).set_index('r')
    bodyWeight


    a  = round(cohen_kappa_score(rater2['armsLocked'], rater1['armsLocked'], labels=None, weights=None),3)
    b = round(cohen_kappa_score(rater3['armsLocked'], rater1['armsLocked'], labels=None, weights=None), 3)
    c = round(cohen_kappa_score(rater3['armsLocked'], rater2['armsLocked'], labels=None, weights=None),3)
    d = round(cohen_kappa_score(rater4['armsLocked'], rater1['armsLocked'], labels=None, weights=None),3)
    e = round(cohen_kappa_score(rater4['armsLocked'], rater2['armsLocked'], labels=None, weights=None),3)
    f = round(cohen_kappa_score(rater4['armsLocked'], rater3['armsLocked'], labels=None, weights=None),3)

    data = {'r':['r1', 'r2', 'r3', 'r4'], 'r1':['1', a, b, d], 'r2':[a, '1', c, e], 'r3':[b, c, '1', f],'r4':[d, e, f, '1']}
    armsLocked = pd.DataFrame(data).set_index('r')
    armsLocked



    y1 = rater1['armsLocked']
    y2 = rater3['armsLocked']
    print("Rater1_video vs Rater3_video armsLocked Cohen's Kappa: " + str(sklearn.metrics.cohen_kappa_score(y1, y2, labels=None, weights=None)))

    y1 = rater1['bodyWeight']
    y2 = rater2['bodyWeight']
    print("Rater1_video vs Rater2_novideo bodyWeight Cohen's Kappa: " + str(
        sklearn.metrics.cohen_kappa_score(y1, y2, labels=None, weights=None)))

    y1 = rater1['armsLocked']
    y2 = rater2['armsLocked']
    print("Rater1_video vs Rater2_novideo armsLocked Cohen's Kappa: " + str(
        sklearn.metrics.cohen_kappa_score(y1, y2, labels=None, weights=None)))

    y1 = rater3['bodyWeight'].astype(int)
    y2 = rater2['bodyWeight']
    print("Rater3_video vs Rater2_novideo bodyWeight Cohen's Kappa: " + str(
        sklearn.metrics.cohen_kappa_score(y1, y2, labels=None, weights=None)))

    y1 = rater3['armsLocked'].astype(int)
    y2 = rater2['armsLocked']
    print("Rater3_video vs Rater2_novideo armsLocked Cohen's Kappa: " + str(
        sklearn.metrics.cohen_kappa_score(y1, y2, labels=None, weights=None)))

    y1 = rater3['bodyWeight']
    y2 = rater4['bodyWeight']
    print("Rater3_video vs Rater4_novideo bodyWeight Cohen's Kappa: " + str(
        sklearn.metrics.cohen_kappa_score(y1, y2, labels=None, weights=None)))

    y1 = rater3['armsLocked'].astype(int)
    y2 = rater4['armsLocked']
    print("Rater3_video vs Rater4_novideo armsLocked Cohen's Kappa: " + str(
        sklearn.metrics.cohen_kappa_score(y1, y2, labels=None, weights=None)))

    y1 = rater1['bodyWeight']
    y2 = rater4['bodyWeight']
    print("Rater1_video vs Rater4_novideo bodyWeight Cohen's Kappa: " + str(
        sklearn.metrics.cohen_kappa_score(y1, y2, labels=None, weights=None)))

    y1 = rater1['armsLocked'].astype(int)
    y2 = rater4['armsLocked']
    print("Rater1_video vs Rater4_novideo armsLocked Cohen's Kappa: " + str(
        sklearn.metrics.cohen_kappa_score(y1, y2, labels=None, weights=None)))