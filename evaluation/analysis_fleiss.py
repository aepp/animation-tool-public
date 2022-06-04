import numpy as np
import pandas as pd
import statsmodels
from statsmodels.stats.inter_rater import fleiss_kappa, aggregate_raters
import data_helper

annotation_name_bw = "bodyWeight"
annotation_name_al = "armsLocked"


def get_annotations(sessions_folder, root_folder="manual_sessions"):
    tensor_data, annotations, attributes = data_helper.get_data_from_files(
        root_folder + "/" + sessions_folder,
        ignore_files=ignore_files,
        res_rate=25,
        to_exclude=to_exclude)
    # print("\nShape of the " + sessions_folder + " tensor_data is: " + str(np.shape(tensor_data)))
    # print("Shape of the " + sessions_folder + " annotations is: " + str(np.shape(annotations)) + "\n")
    return annotations.copy()


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

    # print(rater1[annotation_name_bw])
    # print(np.column_stack((rater1[annotation_name_bw], rater2[annotation_name_bw])))

# np.column_stack((
#     rater1[annotation_name_bw],
#     rater2[annotation_name_bw],
#     rater3[annotation_name_bw],
#     rater4[annotation_name_bw],
#     rater5[annotation_name_bw],
#     rater6[annotation_name_bw],
#     rater7[annotation_name_bw],
#     rater8[annotation_name_bw]
# ))
#     raters_combined = np.array([
#         [rater1[annotation_name_bw]],
#         [rater2[annotation_name_bw]],
#         [rater3[annotation_name_bw]],
#         [rater4[annotation_name_bw]],
#         [rater5[annotation_name_bw]],
#         [rater6[annotation_name_bw]],
#         [rater7[annotation_name_bw]],
#         [rater8[annotation_name_bw]],
#     ])
    # print(raters_combined)
    # aggregated = aggregate_raters(raters_combined)
    # print(aggregated)
    # kappas = fleiss_kappa(aggregated, "fleiss")

    # r1  r2  r3
    #  [1,  1,  1],
    #  [0,  1,  0],
    #  [1,  1,  1],
    #  [1,  0,  0],
    #  [1,  1,  1],
    #  [0,  0,  1],
    #  [0,  0,  0],

    # table = aggregate_raters([
    #     [1,  1,  1],
    #     [0,  1,  0],
    #     [1,  1,  1],
    #     [1,  0,  0],
    #     [1,  1,  1],
    #     [0,  0,  1],
    #     [0,  0,  0]
    # ])

    # mmmmm = np.column_stack((rater1[annotation_name_bw], rater2[annotation_name_bw]))
    # rater1[annotation_name_bw] = map(float, rater1[annotation_name_bw])
    # rater2[annotation_name_bw] = map(float, rater2[annotation_name_bw])
    table = aggregate_raters((rater1[annotation_name_bw], rater2[annotation_name_bw]), len(rater1[annotation_name_bw]))
    print(table)
    kappas = fleiss_kappa(table, "fleiss")
