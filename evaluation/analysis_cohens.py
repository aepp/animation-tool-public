import numpy as np
import pandas as pd
from sklearn.metrics import cohen_kappa_score
import data_helper

annotation_name_bw = "bodyWeight"
annotation_name_al = "armsLocked"


def get_annotations(sessions_folder, root_folder="manual_sessions"):
    tensor_data, annotations, attributes = data_helper.get_data_from_files(
        root_folder + "/" + sessions_folder,
        ignore_files=ignore_files,
        res_rate=25,
        to_exclude=to_exclude)
    print("\nShape of the " + sessions_folder + " tensor_data is: " + str(np.shape(tensor_data)))
    print("Shape of the " + sessions_folder + " annotations is: " + str(np.shape(annotations)) + "\n")
    return annotations.copy()


def get_cohens_kappa(r_a, r_b, annotation_name):
    return round(
        cohen_kappa_score(
            r_a[annotation_name],
            r_b[annotation_name],
            labels=None,
            weights=None),
        3)


def calculate_all_cohens_kappas(annotation_name):
    a = get_cohens_kappa(rater2, rater1, annotation_name)

    b = get_cohens_kappa(rater3, rater1, annotation_name)
    c = get_cohens_kappa(rater3, rater2, annotation_name)

    d = get_cohens_kappa(rater4, rater1, annotation_name)
    e = get_cohens_kappa(rater4, rater2, annotation_name)
    f = get_cohens_kappa(rater4, rater3, annotation_name)

    g = get_cohens_kappa(rater5, rater1, annotation_name)
    h = get_cohens_kappa(rater5, rater2, annotation_name)
    i = get_cohens_kappa(rater5, rater3, annotation_name)
    j = get_cohens_kappa(rater5, rater4, annotation_name)

    k = get_cohens_kappa(rater6, rater1, annotation_name)
    l = get_cohens_kappa(rater6, rater2, annotation_name)
    m = get_cohens_kappa(rater6, rater3, annotation_name)
    n = get_cohens_kappa(rater6, rater4, annotation_name)
    o = get_cohens_kappa(rater6, rater5, annotation_name)

    p = get_cohens_kappa(rater7, rater1, annotation_name)
    q = get_cohens_kappa(rater7, rater2, annotation_name)
    r = get_cohens_kappa(rater7, rater3, annotation_name)
    s = get_cohens_kappa(rater7, rater4, annotation_name)
    t = get_cohens_kappa(rater7, rater5, annotation_name)
    u = get_cohens_kappa(rater7, rater6, annotation_name)

    v = get_cohens_kappa(rater8, rater1, annotation_name)
    w = get_cohens_kappa(rater8, rater2, annotation_name)
    x = get_cohens_kappa(rater8, rater3, annotation_name)
    y = get_cohens_kappa(rater8, rater4, annotation_name)
    z = get_cohens_kappa(rater8, rater5, annotation_name)
    yy = get_cohens_kappa(rater8, rater6, annotation_name)
    zz = get_cohens_kappa(rater8, rater7, annotation_name)

    data = {
        'r': ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8'],
        'r1': ['1', a, b, d, g, k, p, v],
        'r2': [a, '1', c, e, h, l, q, w],
        'r3': [b, c, '1', f, i, m, r, x],
        'r4': [d, e, f, '1', j, n, s, y],
        'r5': [g, h, i, j, '1', o, t, z],
        'r6': [k, l, m, n, o, '1', u, yy],
        'r7': [p, q, r, s, t, u, '1', zz],
        'r8': [v, w, x, y, z, yy, zz, '1']
    }
    return pd.DataFrame(data).set_index('r')


if __name__ == "__main__":
    ignore_files = []
    to_exclude = []
    target_classes = []

    # r1
    rater1 = get_annotations("rater_1_video")
    # r2
    rater2 = get_annotations("rater_2_animation")
    # r3
    rater3 = get_annotations("rater_3_video")
    # r4
    rater4 = get_annotations("rater_4_animation")
    # r5
    rater5 = get_annotations("rater_5_video")
    # r6
    rater6 = get_annotations("rater_6_animation")
    # r7
    rater7 = get_annotations("rater_7_video")
    # r8
    rater8 = get_annotations("rater_8_animation")

    bodyWeight = calculate_all_cohens_kappas(annotation_name_bw)
    armsLocked = calculate_all_cohens_kappas(annotation_name_al)



