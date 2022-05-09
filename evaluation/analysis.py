import numpy as np
import data_helper
from sklearn.metrics import cohen_kappa_score
import pandas as pd

if __name__ == "__main__":
    ignore_files = []
    to_exclude = []
    target_classes = []

    # test 1
    data_folder = "manual_sessions/rater_1_video"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the annotations is: " + str(np.shape(annotations)) + "\n")
    rater1 = annotations.copy()

    # animation 1x
    data_folder = "manual_sessions/rater_2_animation"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the annotations is: " + str(np.shape(annotations)) + "\n")
    rater2 = annotations.copy()

    # test 2
    data_folder = "manual_sessions/rater_3_video"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the annotations is: " + str(np.shape(annotations)) + "\n")
    rater3 = annotations.copy()

    # rater4
    data_folder = "manual_sessions/rater_4_animation"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the annotations is: " + str(np.shape(annotations)) + "\n")
    rater4 = annotations.copy()

    # rater5
    data_folder = "manual_sessions/rater_5_video"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the annotations is: " + str(np.shape(annotations)) + "\n")
    rater5 = annotations.copy()

    # rater6
    data_folder = "manual_sessions/rater_6_animation"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the annotations is: " + str(np.shape(annotations)) + "\n")
    rater6 = annotations.copy()

    '''
               r1     r2     r3     r4     r5     r6
        r                                           
        r1      1      a      b     d      g     m
        r2      a      1      c     e      h     n
        r3      b      c      1     f      i     o   
        r4      d      e      f     1      l     p
        r5      g      h      i     l      1     q
        r6      m      n      o     p      q     1
    
    '''

    a = round(cohen_kappa_score(rater2['bodyWeight'], rater1['bodyWeight'], labels=None, weights=None), 3)
    b = round(cohen_kappa_score(rater3['bodyWeight'], rater1['bodyWeight'], labels=None, weights=None), 3)
    c = round(cohen_kappa_score(rater3['bodyWeight'], rater2['bodyWeight'], labels=None, weights=None), 3)
    d = round(cohen_kappa_score(rater4['bodyWeight'], rater1['bodyWeight'], labels=None, weights=None), 3)
    e = round(cohen_kappa_score(rater4['bodyWeight'], rater2['bodyWeight'], labels=None, weights=None), 3)
    f = round(cohen_kappa_score(rater4['bodyWeight'], rater3['bodyWeight'], labels=None, weights=None), 3)
    g = round(cohen_kappa_score(rater5['bodyWeight'], rater1['bodyWeight'], labels=None, weights=None), 3)
    h = round(cohen_kappa_score(rater5['bodyWeight'], rater2['bodyWeight'], labels=None, weights=None), 3)
    i = round(cohen_kappa_score(rater5['bodyWeight'], rater3['bodyWeight'], labels=None, weights=None), 3)
    l = round(cohen_kappa_score(rater5['bodyWeight'], rater4['bodyWeight'], labels=None, weights=None), 3)
    m = round(cohen_kappa_score(rater6['bodyWeight'], rater1['bodyWeight'], labels=None, weights=None), 3)
    n = round(cohen_kappa_score(rater6['bodyWeight'], rater2['bodyWeight'], labels=None, weights=None), 3)
    o = round(cohen_kappa_score(rater6['bodyWeight'], rater3['bodyWeight'], labels=None, weights=None), 3)
    p = round(cohen_kappa_score(rater6['bodyWeight'], rater4['bodyWeight'], labels=None, weights=None), 3)
    q = round(cohen_kappa_score(rater6['bodyWeight'], rater5['bodyWeight'], labels=None, weights=None), 3)

    data = {'r': ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'], 'r1': ['1', a, b, d, g, m], 'r2': [a, '1', c, e, h, n],
            'r3': [b, c, '1', f, i, o],
            'r4': [d, e, f, '1', l, p], 'r5': [g, h, i, l, '1', q], 'r6': [m, n, o, p, q, '1']}
    bodyWeight = pd.DataFrame(data).set_index('r')
    bodyWeight

    a = round(cohen_kappa_score(rater2['armsLocked'], rater1['armsLocked'], labels=None, weights=None), 3)
    b = round(cohen_kappa_score(rater3['armsLocked'], rater1['armsLocked'], labels=None, weights=None), 3)
    c = round(cohen_kappa_score(rater3['armsLocked'], rater2['armsLocked'], labels=None, weights=None), 3)
    d = round(cohen_kappa_score(rater4['armsLocked'], rater1['armsLocked'], labels=None, weights=None), 3)
    e = round(cohen_kappa_score(rater4['armsLocked'], rater2['armsLocked'], labels=None, weights=None), 3)
    f = round(cohen_kappa_score(rater4['armsLocked'], rater3['armsLocked'], labels=None, weights=None), 3)
    g = round(cohen_kappa_score(rater5['armsLocked'], rater1['armsLocked'], labels=None, weights=None), 3)
    h = round(cohen_kappa_score(rater5['armsLocked'], rater2['armsLocked'], labels=None, weights=None), 3)
    i = round(cohen_kappa_score(rater5['armsLocked'], rater3['armsLocked'], labels=None, weights=None), 3)
    l = round(cohen_kappa_score(rater5['armsLocked'], rater4['armsLocked'], labels=None, weights=None), 3)
    m = round(cohen_kappa_score(rater6['armsLocked'], rater1['armsLocked'], labels=None, weights=None), 3)
    n = round(cohen_kappa_score(rater6['armsLocked'], rater2['armsLocked'], labels=None, weights=None), 3)
    o = round(cohen_kappa_score(rater6['armsLocked'], rater3['armsLocked'], labels=None, weights=None), 3)
    p = round(cohen_kappa_score(rater6['armsLocked'], rater4['armsLocked'], labels=None, weights=None), 3)
    q = round(cohen_kappa_score(rater6['armsLocked'], rater5['armsLocked'], labels=None, weights=None), 3)

    data = {'r': ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'], 'r1': ['1', a, b, d, g, m], 'r2': [a, '1', c, e, h, n],
            'r3': [b, c, '1', f, i, o],
            'r4': [d, e, f, '1', l, p], 'r5': [g, h, i, l, '1', q], 'r6': [m, n, o, p, q, '1']}
    armsLocked = pd.DataFrame(data).set_index('r')
    armsLocked