import { useEffect, useState } from "react";
import { Alert, TextInput, TouchableNativeFeedback, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TextPrimary } from "../../../components/Text";
import { useGlobalAppSettings, useGlobalCategories } from "../../../modules/GlobalContext";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { ionIcons } from "../../../assets/iconPack/ionIcons";
import { ButtonPrimary, ButtonSecondary } from "../../../components/Button";

const EditCategoryScreen = ({ route, navigation }) => {
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
    const { categories, dispatchCategories } = useGlobalCategories();
    const [category, setCategory] = useState(null);

    useEffect(() => {
        setCategory(route?.params?.category)
    }, [])

    useEffect(() => {
        console.log(category)
    }, [category])


    return (
        <>
            {category &&
                <View style={{ backgroundColor: appSettings.theme.style.colors.background, height: '100%' }}>
                    <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>

                        {/* // ! Category Name Section */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingHorizontal: 16 }}>

                            <TouchableNativeFeedback
                                onPress={() => navigation.navigate('Modal Screen', {
                                    title: 'Pick Icon',
                                    modalType: 'iconPicker',
                                    props: ionIcons,
                                    default: category.icon,
                                    selected: (item) => {
                                        setCategory({
                                            ...category,
                                            icon: {
                                                ...category.icon,
                                                name: item.name,
                                                pack: item.pack,
                                            }
                                        })
                                    }
                                })}
                            >
                                <IonIcons
                                    name={category.icon.name}
                                    size={48}
                                    style={{ padding: 16 }}
                                    color={category.icon.color === 'default' ? appSettings.theme.style.colors.foreground : category.icon.color} />
                            </TouchableNativeFeedback>
                            <TextInput
                                maxLength={30}
                                textAlign='center'
                                returnKeyType='done'
                                placeholder='Type category name ...'
                                placeholderTextColor={appSettings.theme.style.text.textSecondary.color}
                                style={[{ ...appSettings.theme.style.text.textPrimary, paddingLeft: 0, paddingVertical: 16, minHeight: 24, fontSize: 24 }, {}]}
                                onChangeText={(string) => {
                                    setCategory({
                                        ...category,
                                        name: string
                                    })
                                }}
                                clearButtonMode='while-editing'
                                defaultValue={category.name}
                                value={category.name}
                            />

                            {category.name &&
                                <IonIcons
                                    onPress={() => setCategory({ ...category, name: '' })}
                                    name='close-circle'
                                    size={20}
                                    style={{ padding: 16 }}
                                    color={appSettings.theme.style.colors.foreground} />}
                        </View>

                        {/* // ! Category Details */}
                        <View style={{ paddingHorizontal: 16 }}>
                            <TextPrimary
                                label='Category Details'
                                style={{ fontSize: 24 }}
                            />
                        </View>


                        {/* // ! Color Section */}
                        <TouchableNativeFeedback
                            onPress={() => navigation.navigate(
                                'Modal Screen', {
                                title: 'Pick Icon Color',
                                modalType: 'colorPicker',
                                selected: (item) => {
                                    setCategory({
                                        ...category,
                                        icon: {
                                            ...category.icon,
                                            color: item.name === 'Default' ? 'default' : item.color
                                        }
                                    })
                                },
                                default: { color: category.icon.color === 'default' ? appSettings.theme.style.colors.foreground : category.icon.color }
                            })}>
                            <View style={appSettings.theme.style.list.listContainer}>
                                <View style={{ ...appSettings.theme.style.list.listItem, flexDirection: 'row', alignItems: 'center' }}>
                                    <IonIcons name='color-fill' size={18} style={{ paddingRight: 16 }} color={appSettings.theme.style.colors.foreground} />
                                    <TextPrimary
                                        label='Color'
                                        style={{ flex: 1 }}
                                    />

                                    {/* // ! Right Side */}
                                    <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>

                                        <View
                                            style={{ height: 26, width: 26, borderRadius: 26 / 2, backgroundColor: category.icon.color === 'default' ? appSettings.theme.style.colors.foreground : category.icon.color }}
                                        />
                                        <IonIcons name='chevron-forward' size={18} style={{ paddingLeft: 16 }} color={appSettings.theme.style.colors.foreground} />

                                    </View>
                                </View>
                            </View>
                        </TouchableNativeFeedback>


                        {/* // ! Balance Section */}
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', height: 36, paddingTop: 8, paddingHorizontal: 16 }}>
                            <IonIcons name='cash' size={18} style={{ paddingRight: 16 }} color={appSettings.theme.style.colors.foreground} />
                            <TextPrimary
                                label='Total Balance'
                                style={{ flex: 1 }}
                            /> */}

                        {/* // ! Right Side */}
                        {/* <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>

                                <TextPrimary
                                    label={`${formatCurrency({ amount: sumBalance(), currency: appSettings.currency.name })}`}
                                    style={{ paddingLeft: 8 }}
                                />
                            </View>
                        </View> */}


                        {/* // ! Total Transactions Section */}
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', height: 36, paddingTop: 8, paddingHorizontal: 16 }}>
                            <IonIcons name='book' size={18} style={{ paddingRight: 16 }} color={appSettings.theme.style.colors.foreground} />
                            <TextPrimary
                                label='Total Transactions'
                                style={{ flex: 1 }}
                            /> */}

                        {/* // ! Right Side */}
                        {/* <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>

                                <TextPrimary
                                    label={`${!countTransactions() ? 'No' : countTransactions()} transactions`}
                                    style={{ flex: 0 }}
                                    numberOfLines={1}
                                />

                            </View>
                        </View> */}



                        {/* // ! Line Separator */}
                        <View style={{ borderColor: appSettings.theme.style.colors.secondary, borderBottomWidth: 1, height: 0, width: '80%', alignSelf: 'center', paddingTop: 16 }}></View>

                        {/* // ! Action Button */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16 }}>

                            {/* // ! Cancel Button */}
                            <View style={{ paddingRight: 8 }}>
                                <ButtonSecondary
                                    label='Cancel'
                                    width={150}
                                    onPress={() => navigation.goBack()}
                                />
                            </View>

                            {/* // ! Delete Button */}
                            <View style={{ paddingLeft: 8 }}>
                                <ButtonPrimary
                                    label='Save'
                                    width={150}
                                    onPress={() => {
                                        if (category.name === '') {
                                            Alert.alert(
                                                'Category Name is Required',
                                                'Please enter a category name',
                                                [
                                                    {
                                                        text: 'OK',
                                                        onPress: () => {
                                                        }, style: 'cancel'
                                                    }
                                                ],
                                                { cancelable: true }
                                            )
                                        } else {
                                            navigation.navigate('Loading Screen', {
                                                label: 'Saving Category ...',
                                                loadingType: 'patchCategory',
                                                patchCategory: category,
                                                initialCategoryPatchCounter: categories.categoryPatchCounter
                                            })
                                        }
                                    }}

                                />
                                {/* <ButtonSecondary
                                    label='Delete'
                                    type='danger'
                                    width={150}
                                    theme={theme.theme}
                                    onPress={() => Alert.alert(
                                        'Delete This Logbook ?',
                                        'All transactions in this logbook will also be deleted. Deleted logbook and transactions can not be restored',
                                        [
                                            {
                                                text: 'No',
                                                onPress: () => {
                                                }, style: 'cancel'
                                            },
                                            {
                                                text: 'Yes',
                                                onPress: () => {
                                                    navigation.navigate('Loading Screen', {
                                                        label: 'Deleting Logbook ...',
                                                        loadingType: 'deleteOneLogbook',
                                                        deleteLogbook: category,
                                                        logbookToOpen: null,
                                                        initialLogbookDeleteCounter: logbooks.logbookDeleteCounter,
                                                        initialSortedLogbookDeleteCounter: sortedTransactions.sortedLogbookDeleteCounter
                                                    })
                                                }
                                            }], { cancelable: false }
                                    )}
                                /> */}
                            </View>

                        </View>


                    </ScrollView>
                </View >}

        </>
    )

}

export default EditCategoryScreen;