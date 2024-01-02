import React, { useMemo, useState } from 'react';
import { Input, Tree, Typography } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
const { Search } = Input;
const x = 3;
const y = 2;
const z = 1;
const defaultData = [];
const generateData = (_level, _preKey, _tns) => {
    const preKey = _preKey || '0';
    const tns = _tns || defaultData;
    const children = [];
    for (let i = 0; i < x; i++) {
        const key = `${preKey}-${i}`;
        tns.push({
            title: key,
            key,
        });
        if (i < y) {
            children.push(key);
        }
    }
    if (_level < 0) {
        return tns;
    }
    const level = _level - 1;
    children.forEach((key, index) => {
        tns[index].children = [];
        return generateData(level, key, tns[index].children);
    });
};
generateData(z);
const dataList = [];
const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { key } = node;
        dataList.push({
            key,
            title: key,
        });
        if (node.children) {
            generateList(node.children);
        }
    }
};
generateList(defaultData);
const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some((item) => item.key === key)) {
                parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey;
};
// const defaultData = [
//     {
//         "title": "0-0",
//         "key": "0-0",
//         "children": [
//             {
//                 "title": "0-0-0",
//                 "key": "0-0-0",
//                 "children": [
//                     {
//                         "title": "0-0-0-0",
//                         "key": "0-0-0-0"
//                     },
//                     {
//                         "title": "0-0-0-1",
//                         "key": "0-0-0-1"
//                     },
//                     {
//                         "title": "0-0-0-2",
//                         "key": "0-0-0-2"
//                     }
//                 ]
//             },
//             {
//                 "title": "0-0-1",
//                 "key": "0-0-1",
//                 "children": [
//                     {
//                         "title": "0-0-1-0",
//                         "key": "0-0-1-0"
//                     },
//                     {
//                         "title": "0-0-1-1",
//                         "key": "0-0-1-1"
//                     },
//                     {
//                         "title": "0-0-1-2",
//                         "key": "0-0-1-2"
//                     }
//                 ]
//             },
//             {
//                 "title": "0-0-2",
//                 "key": "0-0-2"
//             }
//         ]
//     },
//     {
//         "title": "0-1",
//         "key": "0-1",
//         "children": [
//             {
//                 "title": "0-1-0",
//                 "key": "0-1-0",
//                 "children": [
//                     {
//                         "title": "0-1-0-0",
//                         "key": "0-1-0-0"
//                     },
//                     {
//                         "title": "0-1-0-1",
//                         "key": "0-1-0-1"
//                     },
//                     {
//                         "title": "0-1-0-2",
//                         "key": "0-1-0-2"
//                     }
//                 ]
//             },
//             {
//                 "title": "0-1-1",
//                 "key": "0-1-1",
//                 "children": [
//                     {
//                         "title": "0-1-1-0",
//                         "key": "0-1-1-0"
//                     },
//                     {
//                         "title": "0-1-1-1",
//                         "key": "0-1-1-1"
//                     },
//                     {
//                         "title": "0-1-1-2",
//                         "key": "0-1-1-2"
//                     }
//                 ]
//             },
//             {
//                 "title": "0-1-2",
//                 "key": "0-1-2"
//             }
//         ]
//     },
//     {
//         "title": "0-2",
//         "key": "0-2"
//     }
// ]
const FolderTree = () => {
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const onExpand = (newExpandedKeys) => {
        setExpandedKeys(newExpandedKeys);
        setAutoExpandParent(false);
    };
    const onChange = (e) => {
        const { value } = e.target;
        const newExpandedKeys = dataList
            .map((item) => {
                if (item.title.indexOf(value) > -1) {
                    return getParentKey(item.key, defaultData);
                }
                return null;
            })
            .filter((item, i, self) => !!(item && self.indexOf(item) === i));
        setExpandedKeys(newExpandedKeys);
        setSearchValue(value);
        setAutoExpandParent(true);
    };
    const treeData = useMemo(() => {
        const loop = (data) =>
            data.map((item) => {
                const strTitle = item.title;
                const index = strTitle.indexOf(searchValue);
                const beforeStr = strTitle.substring(0, index);
                const afterStr = strTitle.slice(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <Typography.Text mark={true}>{searchValue}</Typography.Text>
                            {afterStr}
                        </span>
                    ) : (
                        <Typography.Text>{strTitle}</Typography.Text>
                    );
                if (item.children) {
                    return {
                        title,
                        key: item.key,
                        children: loop(item.children),
                    };
                }
                return {
                    title,
                    key: item.key,
                };
            });
        return loop(defaultData);
    }, [searchValue]);
    return (
        <div>
            <Input
                placeholder='Search...'
                style={{
                    marginBottom: 8,
                }}
                onChange={onChange}
                prefix={<SearchOutlined />}
            />
            <Tree.DirectoryTree
                switcherIcon={<DownOutlined />}
                onExpand={onExpand}
                onSelect={(keys, info) => {
                }}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                treeData={treeData}
                showLine={true}
            />
        </div>
    );
};
export default FolderTree;