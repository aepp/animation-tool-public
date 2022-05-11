import numpy as np
import pandas as pd
import sklearn
from sklearn.metrics import cohen_kappa_score
import data_helper

if __name__ == "__main__":
    ignore_files = []
    to_exclude = []
    target_classes = []


    #r1
    data_folder = "manual_sessions/rater_1_video"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the r1 tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the r1 annotations is: " + str(np.shape(annotations)) + "\n")
    rater1 = annotations.copy()


    #r2
    data_folder = "manual_sessions/rater_2_animation"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the r2 tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the r2 annotations is: " + str(np.shape(annotations)) + "\n")
    rater2 = annotations.copy()

    #r3
    data_folder = "manual_sessions/rater_3_video"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the r3 tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the r3 annotations is: " + str(np.shape(annotations)) + "\n")
    rater3 = annotations.copy()

    #r4
    data_folder = "manual_sessions/rater_4_animation"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the r4 tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the r4 annotations is: " + str(np.shape(annotations)) + "\n")
    rater4 = annotations.copy()

    #r5
    data_folder = "manual_sessions/rater_5_video"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the r5 tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the r5 annotations is: " + str(np.shape(annotations)) + "\n")
    rater5 = annotations.copy()


    #r6
    data_folder = "manual_sessions/rater_6_animation"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the r6 tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the r6 annotations is: " + str(np.shape(annotations)) + "\n")
    rater6 = annotations.copy()

    #r7
    data_folder = "manual_sessions/rater_7_video"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the r7 tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the r7 annotations is: " + str(np.shape(annotations)) + "\n")
    rater7 = annotations.copy()

    #r8
    data_folder = "manual_sessions/rater_8_animation"
    tensor_data, annotations, attributes = data_helper.get_data_from_files(data_folder, ignore_files=ignore_files,
                                                                           res_rate=25,
                                                                           to_exclude=to_exclude)
    print("\nShape of the r8 tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the r8 annotations is: " + str(np.shape(annotations)) + "\n")
    rater8 = annotations.copy()



    a = round(cohen_kappa_score(rater2['bodyWeight'], rater1['bodyWeight'], labels=None, weights=None),3)
    b = round(cohen_kappa_score(rater3['bodyWeight'], rater1['bodyWeight'], labels=None, weights=None), 3)
    c = round(cohen_kappa_score(rater3['bodyWeight'], rater2['bodyWeight'], labels=None, weights=None),3)
    d = round(cohen_kappa_score(rater4['bodyWeight'], rater1['bodyWeight'], labels=None, weights=None),3)
    e = round(cohen_kappa_score(rater4['bodyWeight'], rater2['bodyWeight'], labels=None, weights=None),3)
    f = round(cohen_kappa_score(rater4['bodyWeight'], rater3['bodyWeight'], labels=None, weights=None),3)

    g = round(cohen_kappa_score(rater5['bodyWeight'], rater1['bodyWeight'], labels=None, weights=None),3)
    h = round(cohen_kappa_score(rater5['bodyWeight'], rater2['bodyWeight'], labels=None, weights=None),3)
    i = round(cohen_kappa_score(rater5['bodyWeight'], rater3['bodyWeight'], labels=None, weights=None),3)
    j = round(cohen_kappa_score(rater5['bodyWeight'], rater4['bodyWeight'], labels=None, weights=None),3)

    k = round(cohen_kappa_score(rater6['bodyWeight'], rater1['bodyWeight'], labels=None, weights=None),3)
    l = round(cohen_kappa_score(rater6['bodyWeight'], rater2['bodyWeight'], labels=None, weights=None),3)
    m = round(cohen_kappa_score(rater6['bodyWeight'], rater3['bodyWeight'], labels=None, weights=None),3)
    n = round(cohen_kappa_score(rater6['bodyWeight'], rater4['bodyWeight'], labels=None, weights=None),3)
    o = round(cohen_kappa_score(rater6['bodyWeight'], rater5['bodyWeight'], labels=None, weights=None),3)

    p = round(cohen_kappa_score(rater7['bodyWeight'], rater1['bodyWeight'], labels=None, weights=None),3)
    q = round(cohen_kappa_score(rater7['bodyWeight'], rater2['bodyWeight'], labels=None, weights=None),3)
    r = round(cohen_kappa_score(rater7['bodyWeight'], rater3['bodyWeight'], labels=None, weights=None),3)
    s = round(cohen_kappa_score(rater7['bodyWeight'], rater4['bodyWeight'], labels=None, weights=None),3)
    t = round(cohen_kappa_score(rater7['bodyWeight'], rater5['bodyWeight'], labels=None, weights=None),3)
    u = round(cohen_kappa_score(rater7['bodyWeight'], rater6['bodyWeight'], labels=None, weights=None),3)

    v = round(cohen_kappa_score(rater8['bodyWeight'], rater1['bodyWeight'], labels=None, weights=None),3)
    w = round(cohen_kappa_score(rater8['bodyWeight'], rater2['bodyWeight'], labels=None, weights=None),3)
    x = round(cohen_kappa_score(rater8['bodyWeight'], rater3['bodyWeight'], labels=None, weights=None),3)
    y = round(cohen_kappa_score(rater8['bodyWeight'], rater4['bodyWeight'], labels=None, weights=None),3)
    z = round(cohen_kappa_score(rater8['bodyWeight'], rater5['bodyWeight'], labels=None, weights=None),3)
    yy = round(cohen_kappa_score(rater8['bodyWeight'], rater6['bodyWeight'], labels=None, weights=None),3)
    zz = round(cohen_kappa_score(rater8['bodyWeight'], rater7['bodyWeight'], labels=None, weights=None),3)


    data = {
        'r':  ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8'],
        'r1': ['1',     a,    b,    d,    g,    k,    p,    v],
        'r2': [a,     '1',    c,    e,    h,    l,    q,    w],
        'r3': [b,       c,  '1',    f,    i,    m,    r,    x],
        'r4': [d,       e,    f,  '1',    j,    n,    s,    y],
        'r5': [g,       h,    i,    j,  '1',    o,    t,    z],
        'r6': [k,       l,    m,    n,    o,  '1',    u,   yy],
        'r7': [p,       q,    r,    s,    t,    u,  '1',   zz],
        'r8': [v,       w,    x,    y,    z,   yy,  zz,   '1']
    }
    bodyWeight = pd.DataFrame(data).set_index('r')
    bodyWeight


    a  = round(cohen_kappa_score(rater2['armsLocked'], rater1['armsLocked'], labels=None, weights=None),3)
    b = round(cohen_kappa_score(rater3['armsLocked'], rater1['armsLocked'], labels=None, weights=None), 3)
    c = round(cohen_kappa_score(rater3['armsLocked'], rater2['armsLocked'], labels=None, weights=None),3)
    d = round(cohen_kappa_score(rater4['armsLocked'], rater1['armsLocked'], labels=None, weights=None),3)
    e = round(cohen_kappa_score(rater4['armsLocked'], rater2['armsLocked'], labels=None, weights=None),3)
    f = round(cohen_kappa_score(rater4['armsLocked'], rater3['armsLocked'], labels=None, weights=None),3)

    g = round(cohen_kappa_score(rater5['armsLocked'], rater1['armsLocked'], labels=None, weights=None),3)
    h = round(cohen_kappa_score(rater5['armsLocked'], rater2['armsLocked'], labels=None, weights=None),3)
    i = round(cohen_kappa_score(rater5['armsLocked'], rater3['armsLocked'], labels=None, weights=None),3)
    j = round(cohen_kappa_score(rater5['armsLocked'], rater4['armsLocked'], labels=None, weights=None),3)

    k = round(cohen_kappa_score(rater6['armsLocked'], rater1['armsLocked'], labels=None, weights=None),3)
    l = round(cohen_kappa_score(rater6['armsLocked'], rater2['armsLocked'], labels=None, weights=None),3)
    m = round(cohen_kappa_score(rater6['armsLocked'], rater3['armsLocked'], labels=None, weights=None),3)
    n = round(cohen_kappa_score(rater6['armsLocked'], rater4['armsLocked'], labels=None, weights=None),3)
    o = round(cohen_kappa_score(rater6['armsLocked'], rater5['armsLocked'], labels=None, weights=None),3)

    p = round(cohen_kappa_score(rater7['armsLocked'], rater1['armsLocked'], labels=None, weights=None),3)
    q = round(cohen_kappa_score(rater7['armsLocked'], rater2['armsLocked'], labels=None, weights=None),3)
    r = round(cohen_kappa_score(rater7['armsLocked'], rater3['armsLocked'], labels=None, weights=None),3)
    s = round(cohen_kappa_score(rater7['armsLocked'], rater4['armsLocked'], labels=None, weights=None),3)
    t = round(cohen_kappa_score(rater7['armsLocked'], rater5['armsLocked'], labels=None, weights=None),3)
    u = round(cohen_kappa_score(rater7['armsLocked'], rater6['armsLocked'], labels=None, weights=None),3)

    v = round(cohen_kappa_score(rater8['armsLocked'], rater1['armsLocked'], labels=None, weights=None),3)
    w = round(cohen_kappa_score(rater8['armsLocked'], rater2['armsLocked'], labels=None, weights=None),3)
    x = round(cohen_kappa_score(rater8['armsLocked'], rater3['armsLocked'], labels=None, weights=None),3)
    y = round(cohen_kappa_score(rater8['armsLocked'], rater4['armsLocked'], labels=None, weights=None),3)
    z = round(cohen_kappa_score(rater8['armsLocked'], rater5['armsLocked'], labels=None, weights=None),3)
    yy = round(cohen_kappa_score(rater8['armsLocked'], rater6['armsLocked'], labels=None, weights=None),3)
    zz = round(cohen_kappa_score(rater8['armsLocked'], rater7['armsLocked'], labels=None, weights=None),3)

    data = {
        'r':  ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8'],
        'r1': ['1',     a,    b,    d,    g,    k,    p,    v],
        'r2': [a,     '1',    c,    e,    h,    l,    q,    w],
        'r3': [b,       c,  '1',    f,    i,    m,    r,    x],
        'r4': [d,       e,    f,  '1',    j,    n,    s,    y],
        'r5': [g,       h,    i,    j,  '1',    o,    t,    z],
        'r6': [k,       l,    m,    n,    o,  '1',    u,   yy],
        'r7': [p,       q,    r,    s,    t,    u,  '1',   zz],
        'r8': [v,       w,    x,    y,    z,   yy,  zz,   '1']
    }
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
