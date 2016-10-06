var discription = [
    'this is the first discription',
    'this is the second discription',
    'this is the third discription',
    'this is the fouth discription',
    'this is the fifth discription',
];

exports.getDisc = function() {
    var index = Math.floor(Math.random() * discription.length);
    return discription[index];
};